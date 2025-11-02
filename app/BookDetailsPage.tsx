import React, { useEffect, useState, useCallback } from "react";
import { Text, View, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { Book } from "@/model/Book";
import { Note } from "@/model/Note";
import { getBookById } from "@/services/BooksService";
import { getNotesByBookId } from "@/services/NotesService";
import BookDetailsComponent from "@/component/BookDetailsComponent";
import NoteBookComponent from "@/component/NotesBookComponent";
import AddNoteComponent from "@/component/AddNoteComponent";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext"; // hook thème

export default function BookDetailsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme(); // récupère le thème courant
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

  useEffect(() => { fetchData(); }, [id]);
  useFocusEffect(useCallback(() => { fetchData(); }, [id]));

  if (loading) {
    return (
      <>
      <Stack.Screen
            options={{
              title: "Chargement...",
              headerStyle: { backgroundColor: theme.colors.surface },
              headerTintColor: theme.colors.text.primary,
              headerShadowVisible: false,
              headerLargeTitle: true,
            }}
          />
        <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text.secondary }]}>Chargement...</Text>
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
              headerStyle: { backgroundColor: theme.colors.surface },
              headerTintColor: theme.colors.text.primary,
              headerShadowVisible: false,
              headerLargeTitle: true,
            }}
          />
        <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.loadingText, { color: theme.colors.text.secondary, textAlign: "center" }]}>
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
              headerStyle: { backgroundColor: theme.colors.surface },
              headerTintColor: theme.colors.text.primary,
              headerShadowVisible: false,
              headerLargeTitle: true,
            }}
          />
      <ScrollView
        style={[styles.scrollContainer, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={{ padding: theme.spacing.md }}
      >
        <BookDetailsComponent {...book} />
        {notes.length > 0 ? (
          <View style={{ marginTop: theme.spacing.lg }}>
            <Text style={{ fontWeight: "bold", marginBottom: theme.spacing.sm, fontSize: theme.typography.body1.fontSize, color: theme.colors.text.primary }}>
              Notes :
            </Text>
            {notes.map((n) => (
              <NoteBookComponent key={n.id} {...n} />
            ))}
          </View>
        ) : (
          <View
            style={{
              marginTop: theme.spacing.lg,
              alignItems: "center",
              justifyContent: "center",
              padding: theme.spacing.md,
              borderWidth: 1,
              borderRadius: theme.radius.md,
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            }}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={48} color={theme.colors.text.secondary} />
            <Text style={{ marginTop: theme.spacing.sm, fontSize: theme.typography.body1.fontSize, color: theme.colors.text.secondary }}>
              Aucune note pour ce livre
            </Text>
          </View>
        )}
        <AddNoteComponent bookId={book.id!} onNoteAdded={fetchData} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
  loadingText: { fontWeight: "400", lineHeight: 22, marginTop: 12 },
});
