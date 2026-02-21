import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { useAuth } from "@/hooks/use-auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(tabs)";
    const inLogin = segments[0] === "login";
    const inOAuth = segments[0] === "oauth";

    if (!isAuthenticated && inAuthGroup) {
      router.replace("/login");
    } else if (isAuthenticated && inLogin) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, loading, segments]);

  return <>{children}</>;
}
