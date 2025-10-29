import { useState } from "react";
import { Button, TextInput, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { addBook } from "@/services/BooksService";
import { Book } from "@/model/Books";

export default function AddBookModal() {
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [editor, setEditor] = useState("");
  const [year, setYear] = useState("");
  const [read, setRead] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [rating, setRating] = useState("");
  const [cover, setCover] = useState("");
  const [theme, setTheme] = useState("");

  const router = useRouter();

  const handleAddBook = async () => {
    try {
      const bookData: Book = {
        name,
        author,
        editor,
        year: Number(year),
        read,
        favorite,
        rating: Number(rating),
        cover: cover || null,
        theme,
      };

      await addBook(bookData);
      router.back();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <TextInput placeholder="Nom" value={name} onChangeText={setName} />
      <TextInput placeholder="Auteur" value={author} onChangeText={setAuthor} />
      <TextInput placeholder="Éditeur" value={editor} onChangeText={setEditor} />
      <TextInput
        placeholder="Année"
        value={year}
        onChangeText={setYear}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Note (0-5)"
        value={rating}
        onChangeText={setRating}
        keyboardType="numeric"
      />
      <TextInput placeholder="Couverture (URL)" value={cover} onChangeText={setCover} />
      <TextInput placeholder="Thème" value={theme} onChangeText={setTheme} />
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 10 }}>
        <Button title={`Lu: ${read ? "Oui" : "Non"}`} onPress={() => setRead(!read)} />
        <Button title={`Favori: ${favorite ? "Oui" : "Non"}`} onPress={() => setFavorite(!favorite)} />
      </View>
      <Button title="Ajouter le livre" onPress={handleAddBook} />
    </ScrollView>
  );
}
