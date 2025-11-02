import React, { useEffect, useMemo, useState } from "react";
import { Text, ScrollView, Pressable, View, StyleSheet, ActivityIndicator, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import { Book } from "@/model/Book";
import { getBooks } from "@/services/BooksService";
import BooksComponent from "@/component/BooksComponent";
import { useTheme } from "@/context/ThemeContext";

export default function BooksPage() {
  const router = useRouter();
  const { theme } = useTheme();

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
  const handleUpdateBook = (updatedBook: Book) => {
    setBooks(prev =>
      prev.map(b => (b.id === updatedBook.id ? updatedBook : b))
    );
  };

  const filtered = useMemo(() => {
    let list = books.slice();
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (b) =>
          (b.name || "").toLowerCase().includes(q) ||
          (b.author || "").toLowerCase().includes(q)
      );
    }
    if (filter === "read") list = list.filter((b) => b.read);
    if (filter === "unread") list = list.filter((b) => !b.read);
    if (filter === "fav") list = list.filter((b) => b.favorite);
    list.sort((a, b) => {
      const A = (a[sortKey] || "").toString().toLowerCase();
      const B = (b[sortKey] || "").toString().toLowerCase();
      return A < B ? -1 : A > B ? 1 : 0;
    });
    return list;
  }, [books, query, filter, sortKey]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ color: theme.colors.text.secondary, marginTop: theme.spacing.md, fontSize: theme.typography.body1.fontSize }}>
          Chargement...
        </Text>
      </View>
    );
  }

  if (books.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Ionicons name="book-outline" size={64} color={theme.colors.text.secondary} />
        <Text style={{ color: theme.colors.text.secondary, marginTop: theme.spacing.md, fontSize: theme.typography.body1.fontSize }}>
          Aucun livre disponible
        </Text>
        <Pressable
          style={{
            backgroundColor: theme.colors.primary,
            paddingVertical: theme.spacing.md,
            paddingHorizontal: theme.spacing.xl,
            borderRadius: theme.radius.round,
            marginTop: theme.spacing.md
          }}
          onPress={() => router.push("./modals/BookModal")}
        >
          <Text style={{ color: theme.colors.text.light, fontSize: theme.typography.body1.fontSize, fontWeight: "600" }}>
            Ajouter un livre
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Bibliothèque",
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.text.primary, // <- ici
          headerShadowVisible: false,
          headerLargeTitle: true,
          headerRight: () => (
            <Pressable onPress={() => router.push("/SettingsScreen")} style={{ marginRight: 16 }}>
              <Ionicons name="settings-outline" size={24} color={theme.colors.text.primary} />
            </Pressable>
          ),
        }}
      />

      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <View style={{
          padding: theme.spacing.md,
          backgroundColor: theme.colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border
        }}>
          <TextInput
            placeholder="Rechercher par titre ou auteur"
            placeholderTextColor={theme.colors.text.secondary}
            value={query}
            onChangeText={setQuery}
            style={{
              backgroundColor: theme.colors.surfaceAlt,
              borderRadius: theme.radius.lg,
              paddingVertical: theme.spacing.sm,
              paddingHorizontal: theme.spacing.md,
              borderWidth: 1,
              borderColor: theme.colors.border,
              marginBottom: theme.spacing.sm,
              color: theme.colors.text.primary,
              fontSize: theme.typography.body1.fontSize
            }}
          />

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: theme.spacing.md }}>
            {["all", "read", "unread", "fav"].map((f) => {
              const active = filter === f;
              const label = f === "all" ? "Tous" : f === "read" ? "Lus" : f === "unread" ? "Non lus" : "Favoris";
              return (
                <Pressable
                  key={f}
                  onPress={() => setFilter(f as any)}
                  style={{
                    paddingVertical: theme.spacing.sm,
                    paddingHorizontal: theme.spacing.md,
                    borderRadius: theme.radius.round,
                    backgroundColor: active ? theme.colors.secondary : theme.colors.surfaceAlt,
                    marginRight: theme.spacing.sm,
                    marginBottom: theme.spacing.xs
                  }}
                >
                  <Text style={{
                    color: active ? theme.colors.text.light : theme.colors.text.secondary,
                    fontSize: theme.typography.body2.fontSize,
                    fontWeight: active ? "600" : "500"
                  }}>
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.surfaceAlt,
            padding: theme.spacing.sm,
            borderRadius: theme.radius.lg,
            marginTop: theme.spacing.sm
          }}>
            <Text style={{
              fontSize: theme.typography.body2.fontSize,
              fontWeight: "600",
              color: theme.colors.text.secondary,
              marginRight: theme.spacing.sm
            }}>
              Trier :
            </Text>

            {["name", "author", "theme"].map((key) => {
              const active = sortKey === key;
              const label = key === "name" ? "Titre" : key === "author" ? "Auteur" : "Thème";
              return (
                <Pressable
                  key={key}
                  onPress={() => setSortKey(key as any)}
                  style={{
                    paddingVertical: theme.spacing.xs,
                    paddingHorizontal: theme.spacing.md,
                    borderRadius: theme.radius.round,
                    backgroundColor: active ? theme.colors.primary : theme.colors.surface,
                    marginRight: theme.spacing.sm
                  }}
                >
                  <Text style={{
                    color: active ? theme.colors.text.light : theme.colors.text.secondary,
                    fontSize: theme.typography.caption.fontSize,
                    fontWeight: active ? "600" : "500"
                  }}>
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <ScrollView contentContainerStyle={{ padding: theme.spacing.md, paddingBottom: theme.spacing.xxl * 2 }} showsVerticalScrollIndicator={false}>
          {errorMessage && (
            <View style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: theme.colors.error,
              padding: theme.spacing.sm,
              borderRadius: theme.radius.md,
              marginBottom: theme.spacing.md
            }}>
              <Ionicons name="alert-circle" size={20} color={theme.colors.text.light} style={{ marginRight: theme.spacing.xs }} />
              <Text style={{ color: theme.colors.text.light, fontSize: theme.typography.body2.fontSize, flex: 1 }}>{errorMessage}</Text>
            </View>
          )}

          {filtered.map((book) => (
            <Pressable
              key={book.id}
              onPress={() => router.navigate({ pathname: '/BookDetailsPage', params: { id: book.id } })}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }, { transform: [{ scale: pressed ? 0.98 : 1 }] }]}
            >
              <BooksComponent {...book} onUpdate={handleUpdateBook} />

            </Pressable>
          ))}
        </ScrollView>

        <Pressable
          style={({ pressed }) => ({
            position: "absolute",
            bottom: theme.spacing.xl,
            right: theme.spacing.xl,
            width: 65,
            height: 65,
            borderRadius: 32.5,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.colors.primary,
            transform: [{ scale: pressed ? 0.95 : 1 }]
          })}
          onPress={() => router.push("./modals/BookModal")}
        >
          <Ionicons name="add" size={32} color={theme.colors.text.light} />
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
