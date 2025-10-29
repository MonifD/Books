import React, { useEffect, useState } from "react";
import { Text, ScrollView, Pressable, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import DisplayBooks from "@/component/DisplayBooks";
import { Book } from "@/model/Books";
import { getBooks } from "@/services/BooksService";

export default function Index() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBooks()
      .then((data) => setBooks(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (books.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Aucun livre disponible.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {books.map((book) => (
          <DisplayBooks key={book.id} {...book} />
        ))}
      </ScrollView>

      <Pressable
        style={styles.fab}
        onPress={() => router.push("./modals/addBookModal")}
      >
        <Ionicons name="add-circle-sharp" size={60} color="#4CAF50" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    alignItems: "center",
    paddingVertical: 10,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
