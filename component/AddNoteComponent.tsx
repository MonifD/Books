import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { addNoteToBook } from "@/services/NotesService";
import { useTheme } from "@/context/ThemeContext";

interface AddNoteProps {
    bookId: number;
    onNoteAdded?: () => void;
}

export default function AddNoteComponent({ bookId, onNoteAdded }: AddNoteProps) {
    const { theme } = useTheme();
    const [noteText, setNoteText] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleAddNote = async () => {
        if (!noteText.trim()) {
            setErrorMessage("Erreur : veuillez entrer une note avant de valider.");
            return;
        }

        setLoading(true);
        try {
            await addNoteToBook(bookId, noteText.trim());
            setNoteText("");
            onNoteAdded?.();
            setErrorMessage(null);
        } catch (error: any) {
            setErrorMessage(error.message || "Impossible d’ajouter la note");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.md,
            padding: theme.spacing.md,
            marginVertical: theme.spacing.md,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
        }}>
            {errorMessage && (
                <View style={{
                    backgroundColor: theme.colors.error,
                    borderRadius: theme.radius.md,
                    padding: theme.spacing.sm,
                    marginBottom: theme.spacing.md,
                    flexDirection: "row",
                    alignItems: "center",
                }}>
                    <Ionicons name="alert-circle" size={20} color={theme.colors.text.light} style={{ marginRight: 8 }} />
                    <Text style={{
                        color: theme.colors.text.light,
                        flex: 1,
                        fontSize: theme.typography.body2.fontSize,
                        fontWeight: "500",
                    }}>
                        {errorMessage}
                    </Text>
                </View>
            )}
            <TextInput
                value={noteText}
                onChangeText={setNoteText}
                placeholder="Ajouter une note..."
                placeholderTextColor={theme.colors.text.secondary}
                style={{
                    backgroundColor: theme.colors.surfaceAlt,
                    borderRadius: theme.radius.sm,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    padding: theme.spacing.sm,
                    fontSize: theme.typography.body1.fontSize,
                    marginBottom: theme.spacing.sm,
                    textAlignVertical: "top",
                }}
                editable={!loading}
                multiline
            />
            <Button
                title={loading ? "Ajout..." : "Ajouter"}
                onPress={handleAddNote}
                disabled={loading}
                color={theme.colors.primary}
            />
        </View>
    );
}
