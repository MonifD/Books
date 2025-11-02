import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { Book } from "@/model/Books";
import { getBookById } from "@/services/BooksService";
import DisplayBookDetails from "@/component/DisplayBookDetails";
import { colors, spacing, typography } from "@/styles/theme";

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
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.loadingText}>Chargement...</Text>
                </View>
            </>
        );
    }

    if (!book) {
        return (
            <>
                <Stack.Screen 
                    options={{ 
                        title: "Livre introuvable",
                        headerStyle: {
                            backgroundColor: colors.surface
                        },
                        headerShadowVisible: false
                    }} 
                />
                <View style={styles.center}>
                    <Text style={[styles.loadingText, { textAlign: 'center' }]}>
                        Impossible de trouver le livre demandé.
                    </Text>
                </View>
            </>
        );
    }

    return (
        <>
            <Stack.Screen 
                options={{ 
                    title: book.name,
                    headerStyle: {
                        backgroundColor: colors.surface
                    },
                    headerShadowVisible: false,
                    headerLargeTitle: true
                }} 
            />
            <View style={styles.container}>
                <DisplayBookDetails {...book} />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: spacing.xl,
    },
    loadingText: {
        fontSize: typography.body1.fontSize,
        lineHeight: typography.body1.lineHeight,
        fontWeight: "400" as const,
        color: colors.text.secondary,
        marginTop: spacing.md,
    },
});
