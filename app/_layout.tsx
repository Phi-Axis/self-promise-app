import "../global.css";
import { Stack } from "expo-router";
import { PromiseProvider } from "../lib/promise-provider";

export default function Layout() {
  return (
    <PromiseProvider>
      <Stack />
    </PromiseProvider>
  );
}
