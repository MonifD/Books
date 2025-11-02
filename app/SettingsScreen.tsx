import React, { useContext } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { ThemeContext } from "@/context/ThemeContext";
import { Stack } from "expo-router";

export default function SettingsScreen() {
  const { theme, themeName, toggleTheme } = useContext(ThemeContext);

  return (
    <>
    <Stack.Screen
        options={{
          title: "Settings",
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.text.primary,
          headerShadowVisible: false,
          headerLargeTitle: true,
        }}
      />
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>Paramètres</Text>

      <View style={styles.row}>
        <Text style={[styles.text, { color: theme.colors.text.primary }]}>Mode sombre</Text>
        <Switch
          value={themeName === "dark"}
          onValueChange={toggleTheme}
          thumbColor={theme.colors.primary}
          trackColor={{ false: "#ccc", true: theme.colors.primaryLight }}
        />
      </View>
    </View>
    </>
    
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 16 },
  title: { fontSize: 24, fontWeight: "700" },
  text: { fontSize: 16 },
});
