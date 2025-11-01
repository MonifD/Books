import { StyleSheet, Text, View, Button } from "react-native";
import { Image } from "expo-image";
import { Book } from "@/model/Books";
import { useRouter } from "expo-router";

export default function DisplayBookDetails(book: Book) {
  const router = useRouter();

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
        </View>
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
});
