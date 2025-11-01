import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { Book } from "@/model/Books";
import { getBookById } from "@/services/BooksService";
import DisplayBookDetails from "@/component/DisplayBookDetails";

export default function BookDetails() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);

    const fetch = () => {
        if (id) {
            setLoading(true);
            getBookById(parseInt(id))
                .then((data) => setBook(data))
                .catch(() => setBook(null))
                .finally(() => setLoading(false));
        }
    };

    useEffect(() => {
        fetch();
    }, [id]);

    useFocusEffect(
        React.useCallback(() => {
            fetch();
        }, [id])
    );

    if (loading) {
        return (
            <>
                <Stack.Screen options={{ title: "Chargement en cours" }} />
                <View style={styles.center}>
                    <Text>Chargement...</Text>
                </View>
            </>
        );
    }

    if (!book) {
        return (
            <>
                <Stack.Screen options={{ title: "Livre introuvable" }} />
                <View style={styles.center}>
                    <Text>Livre introuvable.</Text>
                </View>
            </>
        );
    }

    return (
        <>
            <Stack.Screen options={{ title: `Détails de : ${book.name}` }} />
            <View style={styles.container}>
                <DisplayBookDetails {...book} />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
