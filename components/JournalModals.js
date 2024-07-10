import React from "react";
import { Text, View, StyleSheet, Pressable, Modal, ScrollView } from "react-native";


export default function JournalModals({ modalVisible, selectedItem, handleCloseModal }) {

    return (
        
        <Pressable onPress={() => {}}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleCloseModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalCategory}>Category: {selectedItem.category}</Text>
                        <Text style={styles.modalTitle}>Tittle: {selectedItem.title}</Text>
                        <ScrollView style={{ heigth: 10 }}>
                            <Text style={styles.modalContent}>
                                {selectedItem.content}
                            </Text>
                        </ScrollView>

                        <Pressable
                            style={styles.closeButton}
                            onPress={handleCloseModal}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    modalContainer: {
        width: '90%', // Adjust the width as needed
        maxWidth: 400, // Optional: set a maximum width
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        maxHeight: '80%'
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 10,
    },
    modalCategory: {
        fontSize: 10,
        marginBottom: 10,
    },
    modalContent: {
        fontSize: 16,
        marginBottom: 20,
        // height: 200,

    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
    },
    closeButton: {
        padding: 10,
        backgroundColor: '#2196F3',
        borderRadius: 10,
    },
})