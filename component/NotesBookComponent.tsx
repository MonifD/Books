import React from "react";
import { Text, View } from "react-native";
import { Note } from "@/model/Note";
import { useTheme } from "@/context/ThemeContext";

export default function NoteBookComponent(note: Note) {
  const { theme } = useTheme();

  return (
    <View style={{
      flexDirection: "row",
      alignItems: "flex-start",
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 3,
      elevation: 3,
    }}>
      <View style={{
        width: 6,
        borderRadius: 3,
        backgroundColor: theme.colors.primary,
        marginRight: theme.spacing.md,
      }} />
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: theme.typography.body1.fontSize,
          lineHeight: theme.typography.body1.lineHeight,
          color: theme.colors.text.primary,
          marginBottom: theme.spacing.xs,
        }}>
          {note.content}
        </Text>
        <Text style={{
          fontSize: 12,
          color: theme.colors.text.secondary,
          textAlign: "right",
        }}>
          🕒 {new Date(note.dateISO || Date.now()).toLocaleDateString("fr-FR")}
        </Text>
      </View>
    </View>
  );
}
