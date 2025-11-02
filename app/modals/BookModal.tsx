import React, { useEffect, useState } from "react";
import { Text, TextInput, ScrollView, View, ActivityIndicator, Pressable, StyleSheet } from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { addBook, updateBook, getBookById } from "@/services/BooksService";
import { Book } from "@/model/Book";
import { colors, spacing, shadows, radius, typography } from "@/styles/theme";
import BookStatusButtons from "@/component/BookStatusButtons";

export default function BookModal() {
    const { id: idParam } = useLocalSearchParams<{ id?: string }>();
    const router = useRouter();
    const id = idParam ? Number(idParam) : undefined;
    const isEdit = Boolean(id);

    const [name, setName] = useState("");
    const [author, setAuthor] = useState("");
    const [editor, setEditor] = useState("");
    const [year, setYear] = useState("");
    const [read, setRead] = useState(false);
    const [favorite, setFavorite] = useState(false);
    const [rating, setRating] = useState("");
    const [cover, setCover] = useState("");
    const [theme, setTheme] = useState("");

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        let mounted = true;
        if (isEdit && id) {
            setLoading(true);
            getBookById(id)
                .then((b) => {
                    if (!mounted) return;
                    setName(b.name ?? "");
                    setAuthor(b.author ?? "");
                    setEditor(b.editor ?? "");
                    setYear(b.year ? String(b.year) : "");
                    setRead(Boolean(b.read));
                    setFavorite(Boolean(b.favorite));
                    setRating(b.rating != null ? String(b.rating) : "");
                    setCover(b.cover ?? "");
                    setTheme(b.theme ?? "");
                })
                .catch((err: any) => alert(err.message || "Impossible de charger le livre"))
                .finally(() => setLoading(false));
        }
        return () => {
            mounted = false;
        };
    }, [id]);

    const handleSubmit = async () => {
        const bookData: Partial<Book> = {
            name,
            author,
            editor,
            year: year ? Number(year) : undefined,
            read,
            favorite,
            rating: rating ? Number(rating) : undefined,
            cover: cover || null,
            theme,
        };

        try {
            setSubmitting(true);
            if (isEdit && id) {
                await updateBook(id, bookData);
            } else {
                const newBook: Book = {
                    name,
                    author,
                    editor,
                    year: year ? Number(year) : 0,
                    read,
                    favorite,
                    rating: rating ? Number(rating) : 0,
                    cover: cover || null,
                    theme,
                };
                await addBook(newBook);
            }
            router.back();
        } catch (err: any) {
            alert(err?.message || "Erreur lors de l'envoi");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Chargement...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen
                options={{
                    title: isEdit ? "Modifier un livre" : "Ajouter un livre",
                    headerStyle: { backgroundColor: colors.surface },
                    headerShadowVisible: false,
                }}
            />

            <View style={styles.form}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Informations générales</Text>
                    <TextInput
                        placeholder="Titre du livre"
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
                        placeholderTextColor={colors.text.secondary}
                    />
                    <TextInput
                        placeholder="Auteur"
                        value={author}
                        onChangeText={setAuthor}
                        style={styles.input}
                        placeholderTextColor={colors.text.secondary}
                    />
                    <TextInput
                        placeholder="Éditeur"
                        value={editor}
                        onChangeText={setEditor}
                        style={styles.input}
                        placeholderTextColor={colors.text.secondary}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Détails</Text>
                    <TextInput
                        placeholder="Année de publication"
                        value={year}
                        onChangeText={setYear}
                        keyboardType="numeric"
                        style={styles.input}
                        placeholderTextColor={colors.text.secondary}
                    />
                    <TextInput
                        placeholder="Note (0-5)"
                        value={rating}
                        onChangeText={setRating}
                        keyboardType="numeric"
                        style={styles.input}
                        placeholderTextColor={colors.text.secondary}
                    />
                    <TextInput
                        placeholder="Thème"
                        value={theme}
                        onChangeText={setTheme}
                        style={styles.input}
                        placeholderTextColor={colors.text.secondary}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Image</Text>
                    <TextInput
                        placeholder="URL de la couverture"
                        value={cover}
                        onChangeText={setCover}
                        style={styles.input}
                        placeholderTextColor={colors.text.secondary}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Statut</Text>
                    <BookStatusButtons
                        book={{ id, read, favorite } as Book}
                        onUpdate={(updatedBook) => {
                            setRead(updatedBook.read);
                            setFavorite(updatedBook.favorite);
                        }}
                    />
                </View>

                <Pressable
                    style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={submitting}
                >
                    <Text style={styles.submitButtonText}>
                        {submitting ? "Enregistrement..." : isEdit ? "Modifier le livre" : "Ajouter le livre"}
                    </Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    form: {
        padding: spacing.md,
    },
    inputGroup: {
        marginBottom: spacing.lg,
    },
    label: {
        fontSize: typography.body2.fontSize,
        lineHeight: typography.body2.lineHeight,
        fontWeight: "500" as const,
        color: colors.text.secondary,
        marginBottom: spacing.sm,
    },
    input: {
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.md,
        marginBottom: spacing.sm,
        fontSize: typography.body1.fontSize,
        lineHeight: typography.body1.lineHeight,
        color: colors.text.primary,
    },
    submitButton: {
        backgroundColor: colors.primary,
        borderRadius: radius.md,
        padding: spacing.md,
        alignItems: "center",
        ...shadows.sm,
    },
    submitButtonDisabled: {
        opacity: 0.5,
    },
    submitButtonText: {
        fontSize: typography.body1.fontSize,
        lineHeight: typography.body1.lineHeight,
        fontWeight: "600" as const,
        color: colors.text.light,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        fontSize: typography.body1.fontSize,
        lineHeight: typography.body1.lineHeight,
        fontWeight: "400" as const,
        color: colors.text.secondary,
        marginTop: spacing.md,
    },
});
