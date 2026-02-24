import { Stack } from "expo-router";

export default function CategoryLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        animation: "slide_from_right",
        headerShown: true,
        headerBackTitleVisible: false,
      }}
    />
  );
}
