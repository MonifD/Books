import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Note } from "@/model/Note";
import { colors, spacing, typography } from "@/styles/theme";

export default function NoteBookComponent(note: Note) {
  return (
    <View style={styles.card}>
      <View style={styles.colorStrip} />
      <View style={styles.content}>
        <Text style={styles.noteText}>{note.content}</Text>
        <Text style={styles.date}>
          🕒 {new Date(note.dateISO || Date.now()).toLocaleDateString("fr-FR")}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  colorStrip: {
    width: 6,
    borderRadius: 3,
    backgroundColor: colors.primary || "#4CAF50",
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  noteText: {
    fontSize: typography.body1.fontSize,
    lineHeight: typography.body1.lineHeight,
    color: colors.text.primary || "#333",
    marginBottom: spacing.xs,
  },
  date: {
    fontSize: 12,
    color: colors.text.secondary || "#777",
    textAlign: "right",
  },
});
