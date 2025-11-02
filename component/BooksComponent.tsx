import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { useState } from "react";
import { Book } from "@/model/Book";
import BookStatusButtons from "./BookStatusButtons";

export default function BooksComponent(book: Book) {
	const [currentBook, setCurrentBook] = useState<Book>(book);

	return (
		<View style={styles.card}>
			{currentBook.cover ? (
				<Image source={{ uri: currentBook.cover }} style={styles.image} />
			) : (
				<View style={[styles.image, styles.placeholder]}>
					<Text style={styles.placeholderText}>No Image</Text>
				</View>
			)}

			<View style={styles.txtInCard}>
				<Text style={styles.title}>{currentBook.name}</Text>
				<Text style={styles.text}>Auteur : {currentBook.author}</Text>
				<Text style={styles.text}>Thème : {currentBook.theme}</Text>
			</View>

			<BookStatusButtons book={currentBook} onUpdate={setCurrentBook} />

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
});
