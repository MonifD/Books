import { StyleSheet, Text, View, Modal, TouchableOpacity, ViewStyle, TextStyle, ImageStyle } from "react-native";
import { Image } from "expo-image";
import { Book } from "@/model/Book";
import { useRouter } from "expo-router";
import { deleteBook } from "@/services/BooksService";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography, shadows } from "@/styles/theme";
import BookStatusButtons from "./BookStatusButtons";
import { updateBook } from "@/services/BooksService";

export default function BookDetailsComponent(book: Book) {
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
            console.error(error);
            setErrorMessage(error.message || "Erreur lors de la suppression.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.card as ViewStyle}>
            {errorMessage && (
                <View style={styles.errorBox}>
                    <Ionicons name="alert-circle" size={20} color="white" style={{ marginRight: 8 }} />
                    <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
            )}
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
                <Text style={styles.text}>Note : {currentBook.rating} / 5</Text>

                <View style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map((s) => (
                        <TouchableOpacity key={s} style={{ marginRight: spacing.sm }} onPress={async () => {
                            try {
                                const updated = await updateBook(currentBook.id!, { rating: s });
                                setCurrentBook(updated);
                            } catch (err: any) {
                                console.error(err);
                            }
                        }}>
                            <Ionicons name={s <= (currentBook.rating || 0) ? "star" : "star-outline"} size={20} color={s <= (currentBook.rating || 0) ? colors.primary : colors.text.secondary} />
                        </TouchableOpacity>
                    ))}
                    <Text style={styles.ratingText}>{currentBook.rating ?? 0}/5</Text>
                </View>

                <BookStatusButtons book={currentBook} onUpdate={setCurrentBook} />
                <View style={{ marginTop: 8 }}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() =>
                            router.push({ pathname: "/modals/BookModal", params: { id: book.id } })
                        }
                    >
                        <Ionicons name="pencil" size={20} color={colors.text.light} style={{ marginRight: spacing.xs }} />
                        <Text style={styles.buttonText}>Modifier</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => setModalVisible(true)}
                    >
                        <Ionicons name="trash" size={20} color={colors.text.light} style={{ marginRight: spacing.xs }} />
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
                                style={[styles.button, styles.cancelButton, { marginRight: spacing.md }]}
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

type Styles = {
  card: ViewStyle;
  errorBox: ViewStyle;
  errorText: TextStyle;
  image: ImageStyle;
  placeholder: ViewStyle;
  placeholderText: TextStyle;
  txtInCard: ViewStyle;
  title: TextStyle;
  text: TextStyle;
  starsRow: ViewStyle;
  ratingText: TextStyle;
  editButton: ViewStyle;
  deleteButton: ViewStyle;
  buttonText: TextStyle;
  modalOverlay: ViewStyle;
  modalContent: ViewStyle;
  modalTitle: TextStyle;
  modalText: TextStyle;
  modalButtons: ViewStyle;
  button: ViewStyle;
  cancelButton: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 0,
    margin: spacing.md,
    ...shadows.lg,
    overflow: 'hidden',
  } as ViewStyle,
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.error,
    padding: spacing.sm,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  } as ViewStyle,
  errorText: {
    color: colors.text.light,
    fontSize: typography.body2.fontSize,
    fontWeight: "500",
    flex: 1,
  } as const,
  image: {
    width: "100%",
    height: 300,
    backgroundColor: colors.surfaceAlt,
  } as ImageStyle,
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surfaceAlt,
    height: 300,
  } as ViewStyle,
  placeholderText: {
    color: colors.text.disabled,
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
    fontWeight: "400",
  } as TextStyle,
  txtInCard: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    marginTop: -radius.xl,
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
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
  },
  ratingText: {
    marginLeft: spacing.sm,
    fontSize: typography.body2.fontSize,
    color: colors.text.secondary,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  } as const,
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.error,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    ...shadows.sm,
  } as const,
  buttonText: {
    color: colors.text.light,
    fontWeight: "600" as const,
    fontSize: typography.body2.fontSize,
  } as const,
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  } as const,
  modalContent: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    ...shadows.md,
  } as const,
  modalTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: "center",
  } as TextStyle,
  modalText: {
    fontSize: typography.body1.fontSize,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: spacing.lg,
  } as TextStyle,
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  } as const,
  button: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  } as const,
  cancelButton: {
    backgroundColor: colors.border,
    marginRight: spacing.md,
  } as const,
});
