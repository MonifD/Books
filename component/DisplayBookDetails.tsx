import { StyleSheet, Text, View, Button, Modal, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Book } from "@/model/Books";
import { useRouter } from "expo-router";
import { deleteBook } from "@/services/BooksService";
import { useState } from "react";

export default function DisplayBookDetails(book: Book) {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);


  const handleDelete = async () => {
    try {
      await deleteBook(book.id!);
      setModalVisible(false);
      router.back(); // retourne à la page précédente
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
          <Button
            title="Modifier"
            onPress={() =>
              router.push({ pathname: "/modals/BookModal", params: { id: book.id } })
            }
          />
          <Button title="Supprimer" color="red" onPress={() => setModalVisible(true)} />

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
    flexDirection: "row",
    borderColor: "#4CAF50",
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    width: "90%",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  txtInCard: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    marginBottom: 2,
  },
  image: {
    height: 80,
    width: 80,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 10,
    color: "#999",
    textAlign: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  /* Modal styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 12,
  },
  modalText: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  deleteButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});