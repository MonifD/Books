import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import { addNoteToBook } from "@/services/NotesService";
import { colors, spacing } from "@/styles/theme";

interface AddNoteProps {
  bookId: number;
  onNoteAdded?: () => void;
}

export default function AddNoteComponent({ bookId, onNoteAdded }: AddNoteProps) {
  const [noteText, setNoteText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddNote = async () => {
    if (!noteText.trim()) {
      Alert.alert("Erreur", "Veuillez entrer une note avant de valider.");
      return;
    }

    setLoading(true);
    try {
      await addNoteToBook(bookId, noteText.trim());
      setNoteText("");
      onNoteAdded?.();
    } catch (error: any) {
      Alert.alert("Erreur", error.message || "Impossible d’ajouter la note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={noteText}
        onChangeText={setNoteText}
        placeholder="Ajouter une note..."
        style={styles.input}
        editable={!loading}
        multiline
      />
      <Button title={loading ? "Ajout..." : "Ajouter"} onPress={handleAddNote} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginVertical: spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: spacing.sm,
    fontSize: 15,
    textAlignVertical: "top",
    marginBottom: spacing.sm,
  },
});
