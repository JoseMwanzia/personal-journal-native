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
