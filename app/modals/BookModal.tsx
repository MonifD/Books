import React, { useEffect, useState } from "react";
import { Button, TextInput, ScrollView, View, ActivityIndicator } from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { addBook, updateBook, getBookById } from "@/services/BooksService";
import { Book } from "@/model/Books";

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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Stack.Screen options={{ title: isEdit ? "Modifier un livre" : "Ajouter un livre" }} />
      <TextInput placeholder="Nom" value={name} onChangeText={setName} style={{ marginBottom: 8 }} />
      <TextInput placeholder="Auteur" value={author} onChangeText={setAuthor} style={{ marginBottom: 8 }} />
      <TextInput placeholder="Éditeur" value={editor} onChangeText={setEditor} style={{ marginBottom: 8 }} />
      <TextInput
        placeholder="Année"
        value={year}
        onChangeText={setYear}
        keyboardType="numeric"
        style={{ marginBottom: 8 }}
      />
      <TextInput
        placeholder="Note (0-5)"
        value={rating}
        onChangeText={setRating}
        keyboardType="numeric"
        style={{ marginBottom: 8 }}
      />
      <TextInput placeholder="Couverture (URL)" value={cover} onChangeText={setCover} style={{ marginBottom: 8 }} />
      <TextInput placeholder="Thème" value={theme} onChangeText={setTheme} style={{ marginBottom: 8 }} />
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 10 }}>
        <Button title={`Lu: ${read ? "Oui" : "Non"}`} onPress={() => setRead(!read)} />
        <Button title={`Favori: ${favorite ? "Oui" : "Non"}`} onPress={() => setFavorite(!favorite)} />
      </View>
      <Button title={isEdit ? "Modifier le livre" : "Ajouter le livre"} onPress={handleSubmit} disabled={submitting} />
    </ScrollView>
  );
}
