import React, { useEffect, useMemo, useState } from "react";
import { Text, ScrollView, Pressable, View, StyleSheet, ActivityIndicator, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import { Book } from "@/model/Book";
import { getBooks } from "@/services/BooksService";
import { colors, spacing, shadows, typography, radius } from "@/styles/theme";
import BooksComponent from "@/component/BooksComponent";

export default function Index() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "read" | "unread" | "fav">("all");
  const [sortKey, setSortKey] = useState<"name" | "author" | "theme">("name");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  const fetchBooks = () => {
    setLoading(true);
    getBooks()
      .then((data) => setBooks(data))
      .catch((err: any) => setErrorMessage(err.message || "Impossible de charger les livres"))
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

  const filtered = useMemo(() => {
    let list = books.slice();
    // search
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((b) => (b.name || "").toLowerCase().includes(q) || (b.author || "").toLowerCase().includes(q));
    }
    // filter
    if (filter === "read") list = list.filter((b) => b.read);
    if (filter === "unread") list = list.filter((b) => !b.read);
    if (filter === "fav") list = list.filter((b) => b.favorite);
    // sort
    list.sort((a, b) => {
      const A = (a[sortKey] || "").toString().toLowerCase();
      const B = (b[sortKey] || "").toString().toLowerCase();
      return A < B ? -1 : A > B ? 1 : 0;
    });
    return list;
  }, [books, query, filter, sortKey]);

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
        <View style={styles.headerControls}>
          <TextInput
            placeholder="Rechercher par titre ou auteur"
            placeholderTextColor={colors.text.secondary}
            value={query}
            onChangeText={setQuery}
            style={styles.searchInput}
          />

          <View style={styles.filtersRow}>
            <Pressable onPress={() => setFilter("all")} style={[styles.filterPill, styles.filterPillSpacing, filter === "all" && styles.filterPillActive]}>
              <Text style={[styles.filterText, filter === "all" && styles.filterTextActive]}>Tous</Text>
            </Pressable>
            <Pressable onPress={() => setFilter("read")} style={[styles.filterPill, styles.filterPillSpacing, filter === "read" && styles.filterPillActive]}>
              <Text style={[styles.filterText, filter === "read" && styles.filterTextActive]}>Lus</Text>
            </Pressable>
            <Pressable onPress={() => setFilter("unread")} style={[styles.filterPill, styles.filterPillSpacing, filter === "unread" && styles.filterPillActive]}>
              <Text style={[styles.filterText, filter === "unread" && styles.filterTextActive]}>Non lus</Text>
            </Pressable>
            <Pressable onPress={() => setFilter("fav")} style={[styles.filterPill, styles.filterPillSpacing, filter === "fav" && styles.filterPillActive]}>
              <Text style={[styles.filterText, filter === "fav" && styles.filterTextActive]}>Favoris</Text>
            </Pressable>
          </View>

          <View style={styles.sortRow}>
            <Text style={styles.sortLabel}>Trier : </Text>
            <Pressable onPress={() => setSortKey("name")} style={[styles.sortPill, styles.sortPillSpacing, sortKey === "name" && styles.sortPillActive]}>
              <Text style={[styles.sortText, sortKey === "name" && styles.sortTextActive]}>Titre</Text>
            </Pressable>
            <Pressable onPress={() => setSortKey("author")} style={[styles.sortPill, styles.sortPillSpacing, sortKey === "author" && styles.sortPillActive]}>
              <Text style={[styles.sortText, sortKey === "author" && styles.sortTextActive]}>Auteur</Text>
            </Pressable>
            <Pressable onPress={() => setSortKey("theme")} style={[styles.sortPill, styles.sortPillSpacing, sortKey === "theme" && styles.sortPillActive]}>
              <Text style={[styles.sortText, sortKey === "theme" && styles.sortTextActive]}>Thème</Text>
            </Pressable>
          </View>

        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {errorMessage && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={20} color="white" style={{ marginRight: 8 }} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}
          {filtered.map((book) => (
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
  errorBox: {
    backgroundColor: "#E74C3C",
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    ...shadows.sm,
  },
  errorText: {
    color: "white",
    flex: 1,
    fontSize: typography.body2.fontSize,
    fontWeight: "500",
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
    fontWeight: "400" as const,
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
    fontSize: typography.body1.fontSize,
    lineHeight: typography.body1.lineHeight,
    color: colors.text.light,
    fontWeight: "600" as const
  }
  ,
  sortPillSpacing: {
    marginRight: spacing.sm
  },
  headerControls: {
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm
  },
  filtersRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
    flexWrap: 'wrap'
  },
  filterPill: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.round,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  filterPillSpacing: {
    marginRight: spacing.sm
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  filterText: {
    color: colors.text.secondary,
  },
  filterTextActive: {
    color: colors.text.light
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  sortLabel: {
    fontSize: typography.body2.fontSize,
    lineHeight: typography.body2.lineHeight,
    fontWeight: "400" as const,
    color: colors.text.secondary
  },
  sortPill: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.round,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  sortPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  sortText: {
    color: colors.text.secondary
  },
  sortTextActive: {
    color: colors.text.light
  }
});
