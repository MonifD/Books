import React, { useEffect, useState, useCallback } from "react";
import { Text, View, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { Book } from "@/model/Book";
import { Note } from "@/model/Note";
import { getBookById } from "@/services/BooksService";
import { getNotesByBookId } from "@/services/NotesService";
import { colors, spacing, typography } from "@/styles/theme";
import BookDetailsComponent from "@/component/BookDetailsComponent";
import NoteBookComponent from "@/component/NotesBookComponent";
import AddNoteComponent from "@/component/AddNoteComponent";
import { Ionicons } from "@expo/vector-icons";

export default function BookDetails() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [book, setBook] = useState<Book | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const [bookData, notesData] = await Promise.all([
                getBookById(parseInt(id)),
                getNotesByBookId(parseInt(id)),
            ]);
            setBook(bookData);
            setNotes(notesData);
        } catch {
            setBook(null);
            setNotes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    useFocusEffect(
        useCallback(() => {
            fetchData();
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
                        headerStyle: { backgroundColor: colors.surface },
                        headerShadowVisible: false,
                    }}
                />
                <View style={styles.center}>
                    <Text style={[styles.loadingText, { textAlign: "center" }]}>
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
                    headerStyle: { backgroundColor: colors.surface },
                    headerShadowVisible: false,
                    headerLargeTitle: true,
                }}
            />
            <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
                <BookDetailsComponent {...book} />
                {notes.length > 0 ? (
                    <View style={styles.notesContainer}>
                        <Text style={styles.notesTitle}>Notes :</Text>
                        {notes.map((n) => (
                            <NoteBookComponent key={n.id} {...n} />
                        ))}
                    </View>
                ) : (
                    <View style={styles.noNotesContainer}>
                        <Ionicons name="chatbubble-ellipses-outline" size={48} color={colors.text.secondary} />
                        <Text style={styles.noNotesText}>Aucune note pour ce livre</Text>
                    </View>
                )}
                <AddNoteComponent bookId={book.id!} onNoteAdded={fetchData} />

            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        padding: spacing.md,
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
    notesContainer: {
        marginTop: spacing.lg,
    },
    notesTitle: {
        fontWeight: "bold",
        marginBottom: spacing.sm,
        fontSize: typography.body1.fontSize,
    },
    noteText: {
        marginBottom: spacing.xs,
        color: colors.text.secondary,
    },
    noNotesContainer: {
        marginTop: spacing.lg,
        alignItems: "center",
        justifyContent: "center",
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        backgroundColor: colors.surface,
    },
    noNotesText: {
        marginTop: spacing.sm,
        fontSize: typography.body1.fontSize,
        color: colors.text.secondary,
    },
});
