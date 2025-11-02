import { useEffect } from "react";
import { useRouter, useRootNavigationState } from "expo-router";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { colors } from "@/styles/theme";

export default function Index() {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    // On attend que la navigation soit prête avant de rediriger
    if (!rootNavigationState?.key) return;

    // Petit délai pour éviter le warning "before mounting"
    const timer = setTimeout(() => {
      router.replace("/books");
    }, 50);

    return () => clearTimeout(timer);
  }, [rootNavigationState, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
});

