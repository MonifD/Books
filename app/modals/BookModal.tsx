import React, { useEffect, useState } from "react";
import { Text, TextInput, ScrollView, View, ActivityIndicator, Pressable, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { addBook, updateBook, getBookById } from "@/services/BooksService";
import { Book } from "@/model/Book";
import BookStatusButtons from "@/component/BookStatusButtons";
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

export default function BookModal() {
  const { theme } = useTheme();

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
  const [themeBook, setThemeBook] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
          setThemeBook(b.theme ?? "");
        })
        .catch((err: any) => setErrorMessage(err.message || "Impossible de charger le livre"))
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
      theme: themeBook,
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
          theme: themeBook,
        };
        await addBook(newBook);
      }
      router.back();
    } catch (err: any) {
      setErrorMessage("Impossible d'envoyer le formulaire. " + (err?.message || ""));
    } finally {
      setSubmitting(false);
    }
  };

  const setImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setErrorMessage('Autorisez l\'accès à la galerie pour sélectionner une image.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
        aspect: [3, 4]
      });
      if (!result.canceled && result.assets?.length) {
        setCover(result.assets[0].uri ?? "");
      } else if (!result.canceled && (result as any).uri) {
        setCover((result as any).uri);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Erreur lors de la sélection de l\'image.');
    }
  };

  if (loading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
      }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{
          color: theme.colors.text.secondary,
          marginTop: theme.spacing.md,
          fontSize: theme.typography.body1.fontSize,
          lineHeight: theme.typography.body1.lineHeight
        }}>
          Chargement...
        </Text>
      </View>
    );
  }


  return (


    <ScrollView style={{ backgroundColor: theme.colors.background }}>
      <Stack.Screen
        options={{
          title: isEdit ? "Modifier un livre" : "Ajouter un livre",
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.text.primary,
          headerShadowVisible: false,
          headerLargeTitle: true,
        }}
      />

      <View style={{ padding: theme.spacing.md }}>
        <View style={{ marginBottom: theme.spacing.lg }}>
          <Text style={{ fontSize: theme.typography.body2.fontSize, fontWeight: "500", color: theme.colors.text.secondary, marginBottom: theme.spacing.sm }}>Informations générales</Text>
          <TextInput
            placeholder="Titre du livre"
            value={name}
            onChangeText={setName}
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radius.md,
              borderWidth: 1,
              borderColor: theme.colors.border,
              padding: theme.spacing.md,
              marginBottom: theme.spacing.sm,
              color: theme.colors.text.primary
            }}
            placeholderTextColor={theme.colors.text.secondary}
          />
          <TextInput
            placeholder="Auteur"
            value={author}
            onChangeText={setAuthor}
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radius.md,
              borderWidth: 1,
              borderColor: theme.colors.border,
              padding: theme.spacing.md,
              marginBottom: theme.spacing.sm,
              color: theme.colors.text.primary
            }}
            placeholderTextColor={theme.colors.text.secondary}
          />
          <TextInput
            placeholder="Éditeur"
            value={editor}
            onChangeText={setEditor}
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radius.md,
              borderWidth: 1,
              borderColor: theme.colors.border,
              padding: theme.spacing.md,
              marginBottom: theme.spacing.sm,
              color: theme.colors.text.primary
            }}
            placeholderTextColor={theme.colors.text.secondary}
          />
        </View>

        <View style={{ marginBottom: theme.spacing.lg }}>
          <Text style={{ fontSize: theme.typography.body2.fontSize, fontWeight: "500", color: theme.colors.text.secondary, marginBottom: theme.spacing.sm }}>Détails</Text>
          <TextInput
            placeholder="Année de publication"
            value={year}
            onChangeText={setYear}
            keyboardType="numeric"
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radius.md,
              borderWidth: 1,
              borderColor: theme.colors.border,
              padding: theme.spacing.md,
              marginBottom: theme.spacing.sm,
              color: theme.colors.text.primary
            }}
            placeholderTextColor={theme.colors.text.secondary}
          />

          <Text style={{ fontSize: theme.typography.body2.fontSize, fontWeight: "500", color: theme.colors.text.secondary, marginBottom: theme.spacing.sm }}>Note</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.sm }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <TouchableOpacity key={s} style={{ marginRight: theme.spacing.sm }} onPress={() => setRating(String(s))}>
                <Ionicons
                  name={s <= Number(rating) ? "star" : "star-outline"}
                  size={24}
                  color={s <= Number(rating) ? theme.colors.primary : theme.colors.text.secondary}
                />
              </TouchableOpacity>
            ))}
            <Text style={{ marginLeft: theme.spacing.sm, fontSize: theme.typography.body1.fontSize, fontWeight: "500", color: theme.colors.text.primary }}>{rating || 0}/5</Text>
          </View>

          <TextInput
            placeholder="Thème"
            value={themeBook}
            onChangeText={setThemeBook}
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radius.md,
              borderWidth: 1,
              borderColor: theme.colors.border,
              padding: theme.spacing.md,
              marginBottom: theme.spacing.sm,
              color: theme.colors.text.primary
            }}
            placeholderTextColor={theme.colors.text.secondary}
          />
        </View>

        <View style={{ marginBottom: theme.spacing.lg }}>
          <Text style={{ fontSize: theme.typography.body2.fontSize, fontWeight: "500", color: theme.colors.text.secondary, marginBottom: theme.spacing.sm }}>Image</Text>
          {cover ? (
            <Image source={{ uri: cover }} style={{ width: '100%', height: 180, borderRadius: theme.radius.md, marginBottom: theme.spacing.sm }} />
          ) : null}
          <View style={{ flexDirection: 'row' }}>
            <Pressable
              onPress={setImage}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: theme.spacing.md,
                marginRight: theme.spacing.sm,
                borderRadius: theme.radius.md,
                backgroundColor: theme.colors.surface,
                borderWidth: 1,
                borderColor: theme.colors.border
              }}
            >
              <Text style={{ color: theme.colors.text.primary }}>Sélectionner une image</Text>
            </Pressable>

            <TextInput
              placeholder="URL de la couverture"
              value={cover}
              onChangeText={setCover}
              style={{
                flex: 1,
                backgroundColor: theme.colors.surface,
                borderRadius: theme.radius.md,
                borderWidth: 1,
                borderColor: theme.colors.border,
                padding: theme.spacing.md,
                color: theme.colors.text.primary
              }}
              placeholderTextColor={theme.colors.text.secondary}
            />
          </View>
        </View>

        {isEdit && (
          <View style={{ marginBottom: theme.spacing.lg }}>
            <Text style={{ fontSize: theme.typography.body2.fontSize, fontWeight: "500", color: theme.colors.text.secondary, marginBottom: theme.spacing.sm }}>Statut</Text>
            <BookStatusButtons
              book={{ id, read, favorite } as Book}
              onUpdate={(updatedBook) => {
                setRead(updatedBook.read);
                setFavorite(updatedBook.favorite);
              }}
            />
          </View>
        )}

        {errorMessage && (
          <View style={{
            backgroundColor: theme.colors.error,
            borderRadius: theme.radius.md,
            padding: theme.spacing.sm,
            marginBottom: theme.spacing.md,
            flexDirection: "row",
            alignItems: "center"
          }}>
            <Ionicons name="alert-circle" size={20} color="white" style={{ marginRight: 8 }} />
            <Text style={{ color: "white", flex: 1, fontSize: theme.typography.body2.fontSize, fontWeight: "500" }}>{errorMessage}</Text>
          </View>
        )}

        <Pressable
          onPress={handleSubmit}
          disabled={submitting}
          style={{
            backgroundColor: theme.colors.primary,
            borderRadius: theme.radius.md,
            padding: theme.spacing.md,
            alignItems: "center",
            opacity: submitting ? 0.5 : 1
          }}
        >
          <Text style={{ color: theme.colors.text.light, fontSize: theme.typography.body1.fontSize, fontWeight: "600" }}>
            {submitting ? "Enregistrement..." : isEdit ? "Modifier le livre" : "Ajouter le livre"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
