import "../global.css";
import { Stack } from "expo-router";
import { PromiseProvider } from "../lib/promise-context";
import { TRPCProvider } from "../lib/trpc";

export default function Layout() {
  return (
    <TRPCProvider>
      <PromiseProvider>
        <Stack />
      </PromiseProvider>
    </TRPCProvider>
  );
}
