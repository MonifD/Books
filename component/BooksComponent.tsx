import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { Image } from "expo-image";
import { useState } from "react";
import { Book } from "@/model/Book";
import { updateBook } from "@/services/BooksService";

export default function BooksComponent(book: Book) {
  const [currentBook, setCurrentBook] = useState<Book>(book);

  const toggleRead = async () => {
    try {
      const updated = await updateBook(currentBook.id!, { read: !currentBook.read });
      setCurrentBook(updated);
    } catch (err: any) {
      Alert.alert("Erreur", err.message);
    }
  };

  const toggleFavorite = async () => {
    try {
      const updated = await updateBook(currentBook.id!, { favorite: !currentBook.favorite });
      setCurrentBook(updated);
    } catch (err: any) {
      Alert.alert("Erreur", err.message);
    }
  };

  return (
    <View style={styles.card}>
      {/* Image du livre */}
      {currentBook.cover ? (
        <Image source={{ uri: currentBook.cover }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}

      {/* Texte à gauche */}
      <View style={styles.txtInCard}>
        <Text style={styles.title}>{currentBook.name}</Text>
        <Text style={styles.text}>Auteur : {currentBook.author}</Text>
        <Text style={styles.text}>Thème : {currentBook.theme}</Text>
      </View>

      {/* Bulles à droite */}
      <View style={styles.bubbleColumn}>
        <TouchableOpacity
          style={[
            styles.bubble,
            currentBook.read ? styles.bubbleRead : styles.bubbleUnread,
          ]}
          onPress={toggleRead}
        >
          <Text style={styles.bubbleText}>
            {currentBook.read ? "Lu" : "Non lu"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.bubble,
            currentBook.favorite ? styles.bubbleFav : styles.bubbleUnfav,
          ]}
          onPress={toggleFavorite}
        >
          <Text style={styles.bubbleText}>
            {currentBook.favorite ? "★ Favori" : "☆ Favori"}
          </Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: "space-between",
  },
  txtInCard: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
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
  bubbleColumn: {
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 8,
  },
  bubble: {
    borderRadius: 50,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 70,
  },
  bubbleText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
  bubbleRead: {
    backgroundColor: "#4CAF50",
  },
  bubbleUnread: {
    backgroundColor: "#9E9E9E",
  },
  bubbleFav: {
    backgroundColor: "#FFD700",
  },
  bubbleUnfav: {
    backgroundColor: "#B0BEC5",
  },
});
