export default function ChangeUserName({ navigation, userData }) {
    const [name, setName] = useState('');
    //   console.log(userData.map((user) => user.id))
    const handleChangeUsername = async () => {
        const id = userData.map((user) => user.id)
        try {
            const response = await fetch(`http://192.168.100.166:3000/profile/${parseInt(id)}`, {
                method: 'PUT',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name }),
            });

            if (response.ok) {

                alert("Success changing username!")
            }

        } catch (error) {
            console.error(error);

        }
    };

    return (
            <View style={styles.container}>
                <Button
                    title="Change username"
                    onPress={() => setIsUsernameAccordionOpen(!isUsernameAccordionOpen)}
                />

                {isUsernameAccordionOpen && (
                    <View style={styles.accordion}>
                        <Input
                            placeholder="Enter new username"
                            value={name}
                            onChangeText={setName}
                            // containerStyle={{ marginBottom: 10 }}
                        />
                        <Button title="Submit" onPress={handleChangeUsername} />
                    </View>
                )}
            </View>

    );
}
