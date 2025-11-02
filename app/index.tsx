import { useEffect } from "react";
import { useRouter, useRootNavigationState } from "expo-router";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext"; // <- import du hook thème

export default function Index() {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const { theme } = useTheme(); // <- récupération du thème courant

  useEffect(() => {
    if (!rootNavigationState?.key) return;
    const timer = setTimeout(() => {
      router.replace("/BooksPage");
    }, 50);

    return () => clearTimeout(timer);
  }, [rootNavigationState, router]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
