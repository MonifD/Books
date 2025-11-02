import { Text, View, Modal, TouchableOpacity, Image } from "react-native";
import { Book } from "@/model/Book";
import { useRouter } from "expo-router";
import { deleteBook, updateBook } from "@/services/BooksService";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import BookStatusButtons from "./BookStatusButtons";
import { useTheme } from "@/context/ThemeContext";

export default function BookDetailsComponent(book: Book) {
  const { theme } = useTheme();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentBook, setCurrentBook] = useState<Book>(book);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      await deleteBook(book.id!);
      setModalVisible(false);
      router.back();
    } catch (error: any) {
      setErrorMessage(error.message || "Erreur lors de la suppression.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      margin: theme.spacing.md,
      overflow: 'hidden',
    }}>
      {errorMessage && (
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: theme.colors.error,
          padding: theme.spacing.sm,
          borderRadius: theme.radius.md,
          marginBottom: theme.spacing.md,
        }}>
          <Ionicons name="alert-circle" size={20} color={theme.colors.text.light} style={{ marginRight: theme.spacing.sm }} />
          <Text style={{ color: theme.colors.text.light, flex: 1 }}>{errorMessage}</Text>
        </View>
      )}

      {book.cover ? (
        <Image source={{ uri: book.cover }} style={{
          width: "100%",
          height: 300,
          backgroundColor: theme.colors.surfaceAlt,
        }} />
      ) : (
        <View style={{
          width: "100%",
          height: 300,
          backgroundColor: theme.colors.surfaceAlt,
          justifyContent: "center",
          alignItems: "center",
        }}>
          <Text style={{ color: theme.colors.text.disabled }}>No Image</Text>
        </View>
      )}

      <View style={{
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.surface,
        borderTopLeftRadius: theme.radius.xl,
        borderTopRightRadius: theme.radius.xl,
        marginTop: -theme.radius.xl,
      }}>
        <Text style={{
          fontSize: theme.typography.h2.fontSize,
          fontWeight: "700",
          color: theme.colors.text.primary,
          marginBottom: theme.spacing.sm,
        }}>{book.name}</Text>

        <Text style={{ fontSize: theme.typography.body1.fontSize, color: theme.colors.text.secondary, marginBottom: theme.spacing.xs }}>
          Auteur : {book.author}
        </Text>
        <Text style={{ fontSize: theme.typography.body1.fontSize, color: theme.colors.text.secondary, marginBottom: theme.spacing.xs }}>
          Éditeur : {book.editor}
        </Text>
        <Text style={{ fontSize: theme.typography.body1.fontSize, color: theme.colors.text.secondary, marginBottom: theme.spacing.xs }}>
          Année : {book.year}
        </Text>
        <Text style={{ fontSize: theme.typography.body1.fontSize, color: theme.colors.text.secondary, marginBottom: theme.spacing.xs }}>
          Thème : {book.theme}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", marginTop: theme.spacing.sm }}>
          {[1,2,3,4,5].map((s) => (
            <TouchableOpacity key={s} style={{ marginRight: theme.spacing.sm }} onPress={async () => {
              try {
                const updated = await updateBook(currentBook.id!, { rating: s });
                setCurrentBook(updated);
              } catch {}
            }}>
              <Ionicons name={s <= (currentBook.rating || 0) ? "star" : "star-outline"} size={20} color={s <= (currentBook.rating || 0) ? theme.colors.primary : theme.colors.text.secondary} />
            </TouchableOpacity>
          ))}
          <Text style={{ marginLeft: theme.spacing.sm, color: theme.colors.text.secondary }}>
            {currentBook.rating ?? 0}/5
          </Text>
        </View>

        <BookStatusButtons book={currentBook} onUpdate={setCurrentBook} />

        <View style={{ flexDirection: "row", marginTop: theme.spacing.sm }}>
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: theme.colors.primary,
              paddingVertical: theme.spacing.sm,
              paddingHorizontal: theme.spacing.md,
              borderRadius: theme.radius.md,
              marginRight: theme.spacing.sm,
            }}
            onPress={() => router.push({ pathname: "/modals/BookModal", params: { id: book.id } })}
          >
            <Ionicons name="pencil" size={20} color={theme.colors.text.light} style={{ marginRight: theme.spacing.xs }} />
            <Text style={{ color: theme.colors.text.light }}>Modifier</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: theme.colors.error,
              paddingVertical: theme.spacing.sm,
              paddingHorizontal: theme.spacing.md,
              borderRadius: theme.radius.md,
            }}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="trash" size={20} color={theme.colors.text.light} style={{ marginRight: theme.spacing.xs }} />
            <Text style={{ color: theme.colors.text.light }}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal transparent visible={modalVisible} animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={{ width: "90%", backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, padding: theme.spacing.xl }}>
            <Text style={{ fontSize: theme.typography.h3.fontSize, fontWeight: "600", color: theme.colors.text.primary, marginBottom: theme.spacing.md, textAlign: "center" }}>
              Confirmer la suppression
            </Text>
            <Text style={{ fontSize: theme.typography.body1.fontSize, color: theme.colors.text.secondary, textAlign: "center", marginBottom: theme.spacing.lg }}>
              Êtes-vous sûr de vouloir supprimer le livre : "{book.name}" ?
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: theme.spacing.sm,
                  borderRadius: theme.radius.md,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: theme.colors.border,
                  marginRight: theme.spacing.md,
                }}
                onPress={() => setModalVisible(false)}
                disabled={loading}
              >
                <Text style={{ color: theme.colors.text.primary }}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: theme.spacing.sm,
                  borderRadius: theme.radius.md,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: theme.colors.error,
                }}
                onPress={handleDelete}
                disabled={loading}
              >
                <Text style={{ color: theme.colors.text.light }}>{loading ? "Suppression..." : "Supprimer"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
