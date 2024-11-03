import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import "react-native-get-random-values";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <SafeAreaView style={styles.safeAreaContainer}></SafeAreaView>
      <Provider store={store}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="screens/Buy" options={{ headerTitle: "Buy" }} />
          <Stack.Screen
            name="screens/Insurance"
            options={{ headerTitle: "Insurance" }}
          />
          <Stack.Screen
            name="screens/Lease"
            options={{ headerTitle: "Lease" }}
          />
          <Stack.Screen name="screens/Sell" options={{ headerTitle: "Sell" }} />
          <Stack.Screen
            name="screens/Search"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="screens/MapScreen"
            options={{ headerShown: false }}
          />
        </Stack>
      </Provider>
    </>
  );
}

const styles = {
  safeAreaContainer: { backgroundColor: "black" },
};
