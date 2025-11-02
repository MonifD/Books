import { StyleSheet, Text, View, Modal, TouchableOpacity, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { Book } from "@/model/Books";
import { useRouter } from "expo-router";
import { deleteBook } from "@/services/BooksService";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, shadows, radius, typography } from "@/styles/theme";

export default function DisplayBookDetails(book: Book) {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);


  const handleDelete = async () => {
    try {
      await deleteBook(book.id!);
      setModalVisible(false);
      router.back();
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Erreur lors de la suppression.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      {book.cover ? (
        <Image source={{ uri: book.cover }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}

      <View style={styles.txtInCard}>
        <Text style={styles.title}>{book.name}</Text>
        <Text style={styles.text}>Auteur : {book.author}</Text>
        <Text style={styles.text}>Éditeur : {book.editor}</Text>
        <Text style={styles.text}>Année : {book.year}</Text>
        <Text style={styles.text}>Thème : {book.theme}</Text>
        <Text style={styles.text}>Note : {book.rating} / 5</Text>
        <Text style={styles.text}>
          Favori : {book.favorite ? "⭐ Oui" : "❌ Non"}
        </Text>
        <Text style={styles.text}>
          Lu : {book.read ? "✔ Oui" : "❌ Non"}
        </Text>
        <View style={{ marginTop: 8 }}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              router.push({ pathname: "/modals/BookModal", params: { id: book.id } })
            }
          >
            <Ionicons name="pencil" size={20} color={colors.text.light} />
            <Text style={styles.buttonText}>Modifier</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="trash" size={20} color={colors.text.light} />
            <Text style={styles.buttonText}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmer la suppression</Text>
            <Text style={styles.modalText}>
              Êtes-vous sûr de vouloir supprimer le livre : "{book.name}" ?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={handleDelete}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Suppression..." : "Supprimer"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    margin: spacing.md,
  },
  txtInCard: {
    flex: 1,
    marginTop: spacing.md,
  },
  title: {
    fontSize: typography.h2.fontSize,
    lineHeight: typography.h2.lineHeight,
    fontWeight: "700" as const,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  text: {
    fontSize: typography.body1.fontSize,
    lineHeight: typography.body1.lineHeight,
    fontWeight: "400" as const,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  image: {
    height: 200,
    width: "100%",
    borderRadius: radius.md,
    backgroundColor: colors.border,
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
    height: 200,
    backgroundColor: colors.border,
    borderRadius: radius.md,
  },
  placeholderText: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
    fontWeight: "400" as const,
    color: colors.text.secondary,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  deleteButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: colors.error,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },

  /* Modal styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
  },
  modalTitle: {
    fontSize: typography.h3.fontSize,
    lineHeight: typography.h3.lineHeight,
    fontWeight: "600" as const,
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  modalText: {
    fontSize: typography.body1.fontSize,
    lineHeight: typography.body1.lineHeight,
    fontWeight: "400" as const,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    gap: spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: colors.border,
  },
  buttonText: {
    fontSize: typography.body2.fontSize,
    lineHeight: typography.body2.lineHeight,
    fontWeight: "600" as const,
    color: colors.text.light,
  },
});