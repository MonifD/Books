import React from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <ThemeProvider>
      <Stack 
        screenOptions={{
          headerShown: true,
        }}
      />
    </ThemeProvider>
  );
}