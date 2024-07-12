const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const bcrypt = require('bcrypt');
const db = require('./db');
const cors = require('@koa/cors');
const { pool } = require('./db');
const jwt = require('jsonwebtoken')
const SECRET_KEY = 'MY_secret_key';


const app = new Koa();
const router = new Router();
// Use CORS middleware
app.use(cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

app.use(bodyParser());

// Set up sessions
app.keys = ['your-session-secret'];

const sessionConfig = {
  key: 'koa-session-id', // Name of the cookie to save session ID
  maxAge: null, // Never expires
  overwrite: false, // Overwrite existing session data
  httpOnly: false, // Cookie accessible only via HTTP(S)
  signed: true, // Cookie is signed
  rolling: false, // Reset session maxAge on every response
  renew: false, // Renew session when session nearly expires
  secure: false, // Set true for HTTPS only
  sameSite: 'lax', // Protect against CSRF
};

app.use(session(sessionConfig, app));

// Middleware to protect routes
const authMiddleware = async (ctx, next) => {
  const authHeader = ctx.headers['authorization']

  if (!authHeader) {
    ctx.status = 401;
    ctx.body = 'NO TOKEN. You are not authorized to access this resource';
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    ctx.state.user = decoded
    await next();
  } catch (error) {
    ctx.status = 401;
    ctx.body = 'Invalid token', error;
  }

};

// Registration route
router.post('/register', async (ctx) => {
  const { name, email, password } = ctx.request.body;

  if (!name || !email || !password) {
    ctx.status = 400;
    ctx.body = { message: 'Please create name, email and password' };
    return;
  } else if (!email || !password) {
    ctx.status = 400;
    ctx.body = { message: 'Please create email and password' };
    return;
  } else if (!password) {
    ctx.status = 400;
    ctx.body = { message: 'Please create password' };
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    await db.query(sql, [name, email, hashedPassword]);
    ctx.status = 201;
    ctx.body = { ok: true };
  } catch (err) {
    ctx.status = 500;
    ctx.body = err.message;
  }
});

// Login route
router.post('/login', async (ctx) => {
  const { email, password } = ctx.request.body;

  if (!email || !password) {
    ctx.status = 400;
    ctx.body = { message: 'Please put your email and password' };
    return;
  }

  try {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const result = await db.query(sql, [email]);
    if (result.length > 0) {
      const user = result[0];
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        ctx.session.userId = user.id; // Set session ID upon successful login
        // console.log();
        const responseData = result.map(({ id, name, email }) => ({ id, name, email }))
        const tokenData = jwt.sign({ responseData }, SECRET_KEY) // set token for FE
        ctx.body = { responseData, tokenData }
      } else {
        ctx.status = 401;
        ctx.body = { message: 'Invalid password!' }
      }
    } else {
      ctx.status = 401;
      ctx.body = { message: 'Invalid email!' }
    }
  } catch (err) {
    ctx.status = 500;
    ctx.body = err.message;
  }
});

// Logout route
router.delete('/logout', async (ctx) => {
  ctx.session = null;
  ctx.body = { message: 'Logged out successfully' }
});


// Get all users route
router.get('/users', authMiddleware, async (ctx) => {
  try {
    const sql = 'SELECT * FROM users';
    const users = await db.query(sql);
    ctx.body = users;
  } catch (err) {
    ctx.status = 500;
    ctx.body = err.message;
  }
});

// Get all user/:id route
router.get('/user/:userId', authMiddleware, async (ctx) => {
  const userId = ctx.params.userId;
  try {
    const sql = 'SELECT * FROM users WHERE id = ?';
    const user = await db.query(sql, [userId]);

    ctx.body = user[0];
  } catch (err) {
    ctx.status = 500;
    ctx.body = err.message;
  }
});

// Update username
router.put('/profile/:userId', authMiddleware, async (ctx) => {
  const { name } = ctx.request.body;
  const userId = ctx.params.userId;

  if (!name) {
    ctx.status = 400;
    ctx.body = { message: 'New Username is required' };
    return;
  }

  try {
    const sql = 'UPDATE users SET name = ? WHERE id = ?';
    const result = pool.query(sql, [name, userId]);

    if (result) {
      ctx.response.status = 200;
      ctx.response.body = result.values
    } else {
      ctx.status = 404;
      ctx.body = { message: 'User not found or not authorized' };
    }
  } catch (err) {
    ctx.status = 500;
    ctx.body = { message: err.message };
  }
});

// Update journal
router.put('/journal/:journalId', authMiddleware, async (ctx) => {
  const { title, content, category } = ctx.request.body;
  const journalId = ctx.params.journalId;

  if (!title || !content || !category) {
    ctx.status = 400;
    ctx.body = { message: 'No Changes made!' };
  }

  try {
    const sql = 'UPDATE journals SET title = ?, content = ?, category = ? WHERE id = ?';
    const result = pool.query(sql, [title, content, category, journalId]);

    if (result) {
      ctx.response.status = 200;
      ctx.response.body = result.values
    } else {
      ctx.status = 404;
      ctx.body = { message: 'Journal not found or not authorized' };
    }
  } catch (err) {
    ctx.status = 500;
    ctx.body = { message: err.message };
  }
});


// Update password
router.put('/password/:userId', authMiddleware, async (ctx) => {
  const { oldPassword, newPassword } = ctx.request.body;
  const userId = ctx.params.userId;

  if (!oldPassword || !newPassword) {
    ctx.status = 400;
    ctx.body = { message: 'Old and new passwords are required' };
    return;
  }

  try {
    // Fetch the current password for the user
    const sql = 'SELECT * FROM users WHERE id = ?';
    const getUser = await db.query(sql, [userId]);
    const userPassword = getUser[0].password


    if (userPassword.length === 0) {
      ctx.status = 404;
      ctx.body = { message: 'User not found or not authorized' };
      return;
    }

    // const user = userPassword.values[0];
    if (!userPassword) {
      ctx.status = 500;
      ctx.body = { message: 'User password not found' };
      return;
    }

    const match = await bcrypt.compare(oldPassword, userPassword);

    if (!match) {
      ctx.status = 401;
      ctx.body = { message: 'Old password is incorrect' };
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updateSql = 'UPDATE users SET password = ? WHERE id = ?';
    const result = await pool.query(updateSql, [hashedPassword, userId]);

    if (result) {
      ctx.response.status = 200;
      ctx.response.body = { message: 'Password updated successfully' };
    } else {
      ctx.status = 404;
      ctx.body = { message: 'User not found or not authorized' };
    }
  } catch (err) {
    ctx.status = 500;
    ctx.body = { message: err.message };
  }
});


// Create journal entry route
router.post('/journal/:userId', authMiddleware, async (ctx) => {
  const { title, content, category } = ctx.request.body;
  const userId = ctx.params.userId;

  if (!title || !content || !category) {
    ctx.status = 400;
    return ctx.body = { message: 'Please fill all the fields' };
  }

  try {

    const sql = 'INSERT INTO journals (title, content, category, user_id) VALUES (?, ?, ?, ?)';
    const result = await db.query(sql, [title, content, category, userId]);

    ctx.status = 201;
    const responseData = await db.query('SELECT * FROM journals WHERE id = ?', [result.insertId])
    ctx.body = responseData[0]
  } catch {
    ctx.status = 400;
    ctx.body = { message: 'Fill the required feilds' };
  }
});

// Get specific user journals route
router.get('/journal/:userId', authMiddleware, async (ctx) => {
  const userId = ctx.params.userId;
  try {
    const sql = 'SELECT * FROM journals WHERE user_id = ? ORDER BY id DESC';
    const result = await db.query(sql, [userId]);
    ctx.status = 201;
    ctx.body = result;
  } catch (err) {
    ctx.status = 500;
    ctx.body = err.message;
  }
});

// delete specific user's journal route
router.delete('/delete/:userId/:journalId', authMiddleware , async (ctx) => {
  const { userId, journalId } = ctx.params;

  try {
    const sql = 'DELETE FROM journals WHERE user_id = ? AND id = ?';
    const result = await db.query(sql, [userId, journalId]);

    if (result.affectedRows > 0) {
      ctx.status = 200;
      ctx.body = { success: "Journal was Deleted!" }
    }

    // ctx.status = 404;
    // ctx.body = { message: 'Journal entry not found' };

  } catch (err) {
    ctx.status = 500;
    ctx.body = { message: err.message };
  }
});
app
  .use(router.routes())
  .use(router.allowedMethods());

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
