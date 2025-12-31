import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, Component, ReactNode } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import Colors from "@/constants/colors";
import { OrdersProvider } from "@/contexts/OrdersContext";
import { AppContentProvider } from "@/contexts/AppContentContext";
import { trpc, trpcClient } from "@/lib/trpc";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 1000,
      staleTime: 1000 * 60 * 5,
    },
  },
});

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={errorStyles.container}>
          <StatusBar style="light" />
          <View style={errorStyles.content}>
            <Text style={errorStyles.emoji}>⚠️</Text>
            <Text style={errorStyles.title}>Oops! Something went wrong</Text>
            <Text style={errorStyles.message}>
              We encountered an error while loading the app.
            </Text>
            <ScrollView style={errorStyles.errorBox}>
              <Text style={errorStyles.errorText}>
                {this.state.error?.message || 'Unknown error'}
              </Text>
            </ScrollView>
            <TouchableOpacity
              style={errorStyles.button}
              onPress={() => {
                this.setState({ hasError: false, error: null });
              }}
            >
              <Text style={errorStyles.buttonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const errorStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  errorBox: {
    backgroundColor: Colors.backgroundElevated,
    borderRadius: 12,
    padding: 16,
    maxHeight: 200,
    width: '100%',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  errorText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
});

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
    console.log('[RootLayout] Initializing app...');
    setTimeout(() => {
      SplashScreen.hideAsync();
      console.log('[RootLayout] Splash screen hidden');
    }, 100);
  }, []);

  return (
    <ErrorBoundary>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
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
      </trpc.Provider>
    </ErrorBoundary>
  );
}
