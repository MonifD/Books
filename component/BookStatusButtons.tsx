import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Alert } from "react-native";
import { spacing } from "@/styles/theme";
import { Ionicons } from "@expo/vector-icons";
import { Book } from "@/model/Book";
import { updateBook } from "@/services/BooksService";

interface Props {
    book: Book;
    onUpdate?: (book: Book) => void;
}

export default function BookStatusButtons({ book, onUpdate }: Props) {
    const [currentBook, setCurrentBook] = useState<Book>(book);

    const toggleRead = async () => {
        try {
            const updated = await updateBook(currentBook.id!, { read: !currentBook.read });
            setCurrentBook(updated);
            onUpdate?.(updated);
        } catch (err: any) {
            Alert.alert("Erreur", err.message);
        }
    };

    const toggleFavorite = async () => {
        try {
            const updated = await updateBook(currentBook.id!, { favorite: !currentBook.favorite });
            setCurrentBook(updated);
            onUpdate?.(updated);
        } catch (err: any) {
            Alert.alert("Erreur", err.message);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[
                    styles.bubble,
                    currentBook.read ? styles.bubbleRead : styles.bubbleUnread,
                ]}
                onPress={toggleRead}
            >
                <Text style={styles.bubbleText}>
                    {currentBook.read ? "Lu" : "Non lu"}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleFavorite} style={styles.iconButton}>
                <Ionicons
                    name={currentBook.favorite ? "heart" : "heart-outline"}
                    size={28}
                    color={currentBook.favorite ? "red" : "#9E9E9E"}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        alignItems: "flex-end",
    },
    bubble: {
        borderRadius: 50,
        paddingVertical: 6,
        paddingHorizontal: 12,
        alignItems: "center",
        justifyContent: "center",
        minWidth: 70,
        marginBottom: spacing.sm,
    },
    bubbleText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 12,
    },
    bubbleRead: {
        backgroundColor: "#4CAF50",
    },
    bubbleUnread: {
        backgroundColor: "#9E9E9E",
    },
    iconButton: {
        padding: 4,
    },
});
