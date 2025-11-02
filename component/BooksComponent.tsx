import { StyleSheet, Text, View, TouchableOpacity, ViewStyle, TextStyle, ImageStyle } from "react-native";
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
		<View style={styles.cardContainer}>
			<View style={styles.card}>


				<View style={styles.txtInCard}>
					<Text style={styles.title}>{currentBook.name}</Text>
					<Text style={styles.text}>Auteur : {currentBook.author}</Text>
					<Text style={styles.text}>Thème : {currentBook.theme}</Text>

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
								<Ionicons name={s <= (currentBook.rating || 0) ? "star" : "star-outline"} size={18} color={s <= (currentBook.rating || 0) ? colors.primary : colors.text.secondary} />
							</TouchableOpacity>
						))}
						<Text style={styles.ratingText}>{currentBook.rating ?? 0}/5</Text>
					</View>
				</View>

				<View style={styles.imageSection}>
                    {currentBook.cover ? (
                        <Image source={{ uri: currentBook.cover }} style={styles.image} />
                    ) : (
                        <View style={[styles.image, styles.placeholder]}>
                            <Text style={styles.placeholderText}>No Image</Text>
                        </View>
                    )}
                    {/* Boutons sous l’image */}
                    <BookStatusButtons book={currentBook} onUpdate={setCurrentBook} />
                </View>

			</View>
		</View>
	);
}

type Styles = {
  cardContainer: ViewStyle;
  card: ViewStyle;
  txtInCard: ViewStyle;
  title: TextStyle;
  text: TextStyle;
  imageSection: ViewStyle;
  image: ImageStyle;
  placeholder: ViewStyle;
  placeholderText: TextStyle;
  starsRow: ViewStyle;
  ratingText: TextStyle;
  cardActive: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
	cardContainer: {
		width: "100%",
		paddingHorizontal: spacing.sm,
		marginBottom: spacing.md,
	},
	card: {
		flexDirection: "row",
		borderWidth: 1,
		borderColor: colors.borderLight,
		borderRadius: radius.lg,
		padding: spacing.md,
		backgroundColor: colors.surface,
		alignItems: "center",
		justifyContent: "space-between",
		...shadows.md,
	},
	txtInCard: {
		flex: 1,
		marginRight: spacing.md,
	},
	title: {
		color: colors.text.primary,
		marginBottom: spacing.xs,
		fontSize: typography.h3.fontSize,
		lineHeight: typography.h3.lineHeight,
		fontWeight: "600",
	},
	text: {
		color: colors.text.secondary,
		marginBottom: spacing.xs,
		fontSize: typography.body2.fontSize,
		lineHeight: typography.body2.lineHeight,
		fontWeight: "400",
	},
	imageSection: {
		alignItems: "center",
		justifyContent: "center",
		width: 100,
	},
	image: {
		height: 120,
		width: 80,
		borderRadius: radius.md,
		backgroundColor: colors.surfaceAlt,
		marginBottom: spacing.sm,
	},
	placeholder: {
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.surfaceAlt,
		borderWidth: 1,
		borderColor: colors.borderLight,
		borderStyle: 'dashed',
	},
	placeholderText: {
		color: colors.text.disabled,
		fontSize: typography.caption.fontSize,
		lineHeight: typography.caption.lineHeight,
		fontWeight: "400",
	},
	starsRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: spacing.sm,
		backgroundColor: colors.surfaceAlt,
		padding: spacing.xs,
		borderRadius: radius.sm,
		alignSelf: 'flex-start',
	},
	ratingText: {
		marginLeft: spacing.sm,
		...typography.body2,
		color: colors.text.secondary,
		fontWeight: '600',
	},
	cardActive: {
		...shadows.lg,
		transform: [{ scale: 1.02 }],
	},
});
