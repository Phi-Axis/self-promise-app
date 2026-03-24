import "../../global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { Platform } from "react-native";
import "../../lib/_core/nativewind-pressable";
import { ThemeProvider } from "../../lib/theme-provider";
import {
  SafeAreaFrameContext,
  SafeAreaInsetsContext,
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import type { EdgeInsets, Metrics, Rect } from "react-native-safe-area-context";

import { trpc, createTRPCClient } from "../../lib/trpc";
import { initManusRuntime, subscribeSafeAreaInsets } from "../../lib/_core/manus-runtime";
import { PromiseProvider } from "../../lib/promise-context";

const DEFAULT_WEB_INSETS: EdgeInsets = { top: 0, right: 0, bottom: 0, left: 0 };
const DEFAULT_WEB_FRAME: Rect = { x: 0, y: 0, width: 0, height: 0 };

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const initialInsets = initialWindowMetrics?.insets ?? DEFAULT_WEB_INSETS;
  const initialFrame = initialWindowMetrics?.frame ?? DEFAULT_WEB_FRAME;

  const [insets, setInsets] = useState<EdgeInsets>(initialInsets);
  const [frame, setFrame] = useState<Rect>(initialFrame);

  // Initialize Manus runtime for cookie injection from parent container
  useEffect(() => {
    initManusRuntime();
  }, []);

  const handleSafeAreaUpdate = useCallback((metrics: Metrics) => {
    setInsets(metrics.insets);
    setFrame(metrics.frame);
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    const unsubscribe = subscribeSafeAreaInsets(handleSafeAreaUpdate);
    return () => unsubscribe();
  }, [handleSafeAreaUpdate]);

  // Add Web App Meta Tags for PWA and iOS Home Screen
  useEffect(() => {
    if (Platform.OS !== "web") return;

    // manifest.json リンクを追加
    const manifestLink = document.createElement("link");
    manifestLink.rel = "manifest";
    manifestLink.href = "/manifest.json";
    document.head.appendChild(manifestLink);

    // apple-touch-icon を追加
    const appleTouchIcon = document.createElement("link");
    appleTouchIcon.rel = "apple-touch-icon";
    appleTouchIcon.href = "/apple-touch-icon.png";
    appleTouchIcon.sizes = "180x180";
    document.head.appendChild(appleTouchIcon);

    // viewport メタタグを修正（PWA対応）
    let viewportMeta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement | null;
    if (!viewportMeta) {
      viewportMeta = document.createElement("meta") as HTMLMetaElement;
      (viewportMeta as any).name = "viewport";
      document.head.appendChild(viewportMeta);
    }
    viewportMeta.setAttribute("content", "width=device-width, initial-scale=1, viewport-fit=cover");

    // theme-color メタタグを追加
    const themeColor = document.createElement("meta");
    themeColor.name = "theme-color";
    themeColor.content = "#0a7ea4";
    document.head.appendChild(themeColor);

    // apple-mobile-web-app-capable を追加
    const webAppCapable = document.createElement("meta");
    webAppCapable.name = "apple-mobile-web-app-capable";
    webAppCapable.content = "yes";
    document.head.appendChild(webAppCapable);

    // apple-mobile-web-app-status-bar-style を追加
    const statusBarStyle = document.createElement("meta");
    statusBarStyle.name = "apple-mobile-web-app-status-bar-style";
    statusBarStyle.content = "black-translucent";
    document.head.appendChild(statusBarStyle);

    // apple-mobile-web-app-title を追加
    const webAppTitle = document.createElement("meta");
    webAppTitle.name = "apple-mobile-web-app-title";
    webAppTitle.content = "約束手帳";
    document.head.appendChild(webAppTitle);

    // mobile-web-app-status-bar-style を追加（Android対応）
    const mobileStatusBar = document.createElement("meta");
    mobileStatusBar.name = "mobile-web-app-status-bar-style";
    mobileStatusBar.content = "black-translucent";
    document.head.appendChild(mobileStatusBar);

    // msapplication-TileColor を追加（Windows対応）
    const msTileColor = document.createElement("meta");
    msTileColor.name = "msapplication-TileColor";
    msTileColor.content = "#0a7ea4";
    document.head.appendChild(msTileColor);
  }, []);

  // Create clients once and reuse them
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Disable automatic refetching on window focus for mobile
            refetchOnWindowFocus: false,
            // Retry failed requests once
            retry: 1,
          },
        },
      }),
  );
  const [trpcClient] = useState(() => createTRPCClient());

  // Ensure minimum 8px padding for top and bottom on mobile
  const providerInitialMetrics = useMemo(() => {
    const metrics = initialWindowMetrics ?? { insets: initialInsets, frame: initialFrame };
    return {
      ...metrics,
      insets: {
        ...metrics.insets,
        top: Math.max(metrics.insets.top, 16),
        bottom: Math.max(metrics.insets.bottom, 12),
      },
    };
  }, [initialInsets, initialFrame]);

  const content = (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <PromiseProvider>
            {/* Default to hiding native headers so raw route segments don't appear (e.g. "(tabs)", "products/[id]"). */}
            {/* If a screen needs the native header, explicitly enable it and set a human title via Stack.Screen options. */}
            {/* in order for ios apps tab switching to work properly, use presentation: "fullScreenModal" for login page, whenever you decide to use presentation: "modal*/}
            <Stack screenOptions={{ headerShown: false }} initialRouteName="promise-input">
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="oauth/callback" />
              <Stack.Screen name="promise-input" />
              <Stack.Screen name="mark-checked" />
              <Stack.Screen name="reflection-input" />
              <Stack.Screen name="completion-screen" />
              <Stack.Screen name="archived-folder" />
              <Stack.Screen name="settings" />
            </Stack>
            <StatusBar style="auto" />
          </PromiseProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </GestureHandlerRootView>
  );

  const shouldOverrideSafeArea = Platform.OS === "web";

  if (shouldOverrideSafeArea) {
    return (
      <ThemeProvider>
        <SafeAreaProvider initialMetrics={providerInitialMetrics}>
          <SafeAreaFrameContext.Provider value={frame}>
            <SafeAreaInsetsContext.Provider value={insets}>
              {content}
            </SafeAreaInsetsContext.Provider>
          </SafeAreaFrameContext.Provider>
        </SafeAreaProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider initialMetrics={providerInitialMetrics}>{content}</SafeAreaProvider>
    </ThemeProvider>
  );
}
