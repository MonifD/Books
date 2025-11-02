import React, { useState } from "react";
import { Text, View, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Book } from "@/model/Book";
import { updateBook } from "@/services/BooksService";
import { useTheme } from "@/context/ThemeContext";

interface Props {
  book: Book;
  onUpdate?: (book: Book) => void;
}

export default function BookStatusButtons({ book, onUpdate }: Props) {
  const { theme } = useTheme();
  const [currentBook, setCurrentBook] = useState<Book>(book);

  const toggleRead = async () => {
    try {
      const updated = await updateBook(currentBook.id!, { read: !currentBook.read });
      setCurrentBook(updated);
      onUpdate?.(updated);
    } catch (err: any) {
      Alert.alert("Erreur", err.message);
    }
  };

  const toggleFavorite = async () => {
    try {
      const updated = await updateBook(currentBook.id!, { favorite: !currentBook.favorite });
      setCurrentBook(updated);
      onUpdate?.(updated);
    } catch (err: any) {
      Alert.alert("Erreur", err.message);
    }
  };

  return (
    <View style={{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.sm,
      paddingTop: theme.spacing.md,
    }}>
      <TouchableOpacity
        style={{
          borderRadius: 50,
          paddingVertical: 6,
          paddingHorizontal: 12,
          alignItems: "center",
          justifyContent: "center",
          minWidth: 70,
          marginBottom: theme.spacing.sm,
          backgroundColor: currentBook.read ? theme.colors.success : theme.colors.border,
        }}
        onPress={toggleRead}
      >
        <Text style={{ color: theme.colors.text.light, fontWeight: "600", fontSize: 12 }}>
          {currentBook.read ? "Lu" : "Non lu"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={toggleFavorite} style={{ padding: 4 }}>
        <Ionicons
          name={currentBook.favorite ? "heart" : "heart-outline"}
          size={28}
          color={currentBook.favorite ? theme.colors.secondary : theme.colors.text.disabled}
        />
      </TouchableOpacity>
    </View>
  );
}