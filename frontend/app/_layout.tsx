import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Stack } from "expo-router";
import "../global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";

const queryClient = new QueryClient();

export default function RootLayout() {

const [fontsLoaded] = useFonts({
  "Gotham-Black": require("../assets/fonts/GothamBlack.ttf"),
  "Gotham-BlackItalic": require("../assets/fonts/GothamBlackItalic.ttf"),
  "Gotham-Bold": require("../assets/fonts/GothamBold.ttf"),
  "Gotham-BoldItalic": require("../assets/fonts/GothamBoldItalic.ttf"),
  "Gotham-Light": require("../assets/fonts/GothamLight.ttf"),
  "Gotham-LightItalic": require("../assets/fonts/GothamLightItalic.ttf"),
  "Gotham-Medium": require("../assets/fonts/GothamMedium.ttf"),
  "Gotham-MediumItalic": require("../assets/fonts/GothamMediumItalic.ttf"),
  "Gotham-Thin": require("../assets/fonts/GothamThin.ttf"),
  "Gotham-ThinItalic": require("../assets/fonts/GothamThinItalic.ttf"),
  "Gotham-Ultra": require("../assets/fonts/GothamUltra.ttf"),
  "Gotham-UltraItalic": require("../assets/fonts/GothamUltraItalic.ttf"),
  "Gotham-XLight": require("../assets/fonts/GothamXLight.ttf"),
  "Gotham-XLightItalic": require("../assets/fonts/GothamXLightItalic.ttf"),
});

  if (!fontsLoaded) return null;

  return (
    <ClerkProvider tokenCache={tokenCache}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
