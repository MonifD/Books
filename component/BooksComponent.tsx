import { Text, View, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { useState } from "react";
import { Book } from "@/model/Book";
import BookStatusButtons from "./BookStatusButtons";
import { Ionicons } from "@expo/vector-icons";
import { updateBook } from "@/services/BooksService";
import { useTheme } from "@/context/ThemeContext";

interface BooksComponentProps extends Book {
	onUpdate?: (book: Book) => void;
}

export default function BooksComponent(book: BooksComponentProps) {
	const { theme } = useTheme();
	const [currentBook, setCurrentBook] = useState<Book>(book);

	return (
		<View style={{ width: "100%", paddingHorizontal: theme.spacing.sm, marginBottom: theme.spacing.md }}>
			<View style={{
				flexDirection: "row",
				borderWidth: 1,
				borderColor: theme.colors.border,
				borderRadius: theme.radius.lg,
				padding: theme.spacing.md,
				backgroundColor: theme.colors.surface,
				alignItems: "center",
				justifyContent: "space-between",
			}}>
				<View style={{ flex: 1, marginRight: theme.spacing.md }}>
					<Text style={{
						color: theme.colors.text.primary,
						marginBottom: theme.spacing.xs,
						fontSize: theme.typography.h3.fontSize,
						lineHeight: theme.typography.h3.lineHeight,
						fontWeight: "600",
					}}>
						{currentBook.name}
					</Text>
					<Text style={{
						color: theme.colors.text.secondary,
						marginBottom: theme.spacing.xs,
						fontSize: theme.typography.body2.fontSize,
						lineHeight: theme.typography.body2.lineHeight,
						fontWeight: "400",
					}}>Auteur : {currentBook.author}</Text>
					<Text style={{
						color: theme.colors.text.secondary,
						marginBottom: theme.spacing.xs,
						fontSize: theme.typography.body2.fontSize,
						lineHeight: theme.typography.body2.lineHeight,
						fontWeight: "400",
					}}>Thème : {currentBook.theme}</Text>

					<View style={{
						flexDirection: 'row',
						alignItems: 'center',
						marginTop: theme.spacing.sm,
						backgroundColor: theme.colors.surfaceAlt,
						padding: theme.spacing.xs,
						borderRadius: theme.radius.sm,
						alignSelf: 'flex-start',
					}}>
						{[1, 2, 3, 4, 5].map((s) => (
							<TouchableOpacity key={s} style={{ marginRight: theme.spacing.sm }} onPress={async () => {
								try {
									const updated = await updateBook(currentBook.id!, { rating: s });
									setCurrentBook(updated);
								} catch { }
							}}>
								<Ionicons
									name={s <= (currentBook.rating || 0) ? "star" : "star-outline"}
									size={18}
									color={s <= (currentBook.rating || 0) ? theme.colors.primary : theme.colors.text.secondary}
								/>
							</TouchableOpacity>
						))}
						<Text style={{
							marginLeft: theme.spacing.sm,
							fontSize: theme.typography.body2.fontSize,
							lineHeight: theme.typography.body2.lineHeight,
							fontWeight: '600',
							color: theme.colors.text.secondary
						}}>
							{currentBook.rating ?? 0}/5
						</Text>
					</View>
				</View>

				<View style={{ alignItems: "center", justifyContent: "center", width: 100 }}>
					{currentBook.cover ? (
						<Image source={{ uri: currentBook.cover }} style={{
							height: 120,
							width: 80,
							borderRadius: theme.radius.md,
							backgroundColor: theme.colors.surfaceAlt,
							marginBottom: theme.spacing.sm
						}} />
					) : (
						<View style={{
							height: 120,
							width: 80,
							borderRadius: theme.radius.md,
							backgroundColor: theme.colors.surfaceAlt,
							borderWidth: 1,
							borderColor: theme.colors.border,
							borderStyle: 'dashed',
							justifyContent: "center",
							alignItems: "center",
							marginBottom: theme.spacing.sm
						}}>
							<Text style={{ color: theme.colors.text.disabled }}>No Image</Text>
						</View>
					)}

					<BookStatusButtons book={currentBook} onUpdate={(updated) => {
						setCurrentBook(updated); 
						book.onUpdate?.(updated);
					}} />
				</View>
			</View>
		</View>
	);
}
