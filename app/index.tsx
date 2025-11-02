import React, { useEffect, useState } from "react";
import { Text, ScrollView, Pressable, View, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import { Book } from "@/model/Book";
import { getBooks } from "@/services/BooksService";
import { colors, spacing, shadows, typography } from "@/styles/theme";
import BooksComponent from "@/component/BooksComponent";

export default function Index() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = () => {
    setLoading(true);
    getBooks()
      .then((data) => setBooks(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchBooks();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.statusText}>Chargement...</Text>
      </View>
    );
  }

  if (books.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons name="book-outline" size={64} color={colors.text.secondary} />
        <Text style={styles.statusText}>Aucun livre disponible</Text>
        <Pressable
          style={styles.addButton}
          onPress={() => router.push("./modals/BookModal")}
        >
          <Text style={styles.addButtonText}>Ajouter un livre</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Bibliothèque",
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerShadowVisible: false,
          headerLargeTitle: true
        }} 
      />
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {books.map((book) => (
            <Pressable
              key={book.id}
              onPress={() =>
                router.navigate({
                  pathname: '/pagesBook/pageBookDetails',
                  params: { id: book.id }
                })}
              style={({ pressed }) => [
                { opacity: pressed ? 0.7 : 1 },
                { transform: [{ scale: pressed ? 0.98 : 1 }] }
              ]}
            >
              <BooksComponent {...book} />
            </Pressable>
          ))}
        </ScrollView>

        <Pressable
          style={({ pressed }) => [
            styles.fab,
            { transform: [{ scale: pressed ? 0.95 : 1 }] }
          ]}
          onPress={() => router.push("./modals/BookModal")}
        >
          <Ionicons name="add" size={32} color={colors.text.light} />
        </Pressable>
      </View>
    </>
  );
}


const styles = StyleSheet.create({
  scrollContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xxl * 2,
  },
  fab: {
    position: "absolute",
    bottom: spacing.xl,
    right: spacing.xl,
    backgroundColor: colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.lg
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  statusText: {
    fontSize: typography.body1.fontSize,
    lineHeight: typography.body1.lineHeight,
    fontWeight: "400",
    color: colors.text.secondary,
    marginTop: spacing.md,
    textAlign: 'center'
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 100,
    marginTop: spacing.xl,
    ...shadows.sm
  },
  addButtonText: {
    ...typography.body1,
    color: colors.text.light,
    fontWeight: "600"
  }
});
