import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { useState } from "react";
import { Book } from "@/model/Book";
import BookStatusButtons from "./BookStatusButtons";
import { Ionicons } from "@expo/vector-icons";
import { updateBook } from "@/services/BooksService";
import { colors, spacing, radius, typography, shadows } from "@/styles/theme";

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
				
				<View style={styles.starsRow}>
					{[1,2,3,4,5].map((s) => (
							<TouchableOpacity key={s} style={{ marginRight: spacing.sm }} onPress={async () => {
							try {
								const updated = await updateBook(currentBook.id!, { rating: s });
								setCurrentBook(updated);
							} catch (err:any) {
								console.error(err);
							}
						}}>
							<Ionicons name={s <= (currentBook.rating || 0) ? "star" : "star-outline"} size={18} color={s <= (currentBook.rating || 0) ? colors.primary : colors.text.secondary} />
						</TouchableOpacity>
					))}
					<Text style={styles.ratingText}>{currentBook.rating ?? 0}/5</Text>
				</View>
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
	starsRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: spacing.xs,
	},
	ratingText: {
		marginLeft: spacing.sm,
		fontSize: typography.body2.fontSize,
		color: colors.text.secondary,
	},
    cardActive: {
        ...shadows.md
    },
});
