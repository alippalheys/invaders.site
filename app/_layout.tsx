import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import Colors from "@/constants/colors";
import { OrdersProvider } from "@/contexts/OrdersContext";
import { AppContentProvider } from "@/contexts/AppContentContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="admin" options={{ presentation: 'modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <OrdersProvider>
        <AppContentProvider>
          <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.background }}>
            <StatusBar style="light" />
            <RootLayoutNav />
          </GestureHandlerRootView>
        </AppContentProvider>
      </OrdersProvider>
    </QueryClientProvider>
  );
}
