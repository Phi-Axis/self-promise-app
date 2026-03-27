import "../global.css";
import { Stack } from "expo-router";
import { PromiseProvider } from "../lib/promise-context";

export default function Layout() {
  return (
    <PromiseProvider>
      <Stack />
    </PromiseProvider>
  );
}
