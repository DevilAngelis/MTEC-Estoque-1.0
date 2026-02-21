import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import * as Auth from "@/lib/_core/auth";

export default function LoginScreen() {
  const colors = useColors();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const loginMutation = trpc.auth.login.useMutation();
  const registerMutation = trpc.auth.register.useMutation();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Erro", "Preencha email e senha");
      return;
    }
    try {
      const user = await loginMutation.mutateAsync({ email: email.trim(), password });
      await Auth.setUserInfo({
        id: user.id,
        openId: user.openId,
        name: user.name,
        email: user.email,
        loginMethod: user.loginMethod,
        lastSignedIn: new Date(user.lastSignedIn),
      });
      router.replace("/(tabs)");
    } catch (e: any) {
      Alert.alert("Erro", e.message || "Falha ao fazer login");
    }
  };

  const handleRegister = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Erro", "Preencha email e senha");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Erro", "Senha deve ter no mínimo 6 caracteres");
      return;
    }
    try {
      const user = await registerMutation.mutateAsync({
        email: email.trim(),
        password,
        name: name.trim() || undefined,
      });
      await Auth.setUserInfo({
        id: user.id,
        openId: user.openId,
        name: user.name,
        email: user.email,
        loginMethod: user.loginMethod,
        lastSignedIn: new Date(user.lastSignedIn),
      });
      router.replace("/(tabs)");
    } catch (e: any) {
      Alert.alert("Erro", e.message || "Falha ao cadastrar");
    }
  };

  const isLoading = loginMutation.isPending || registerMutation.isPending;

  return (
    <ScreenContainer className="flex-1 bg-[#0a0a0a]">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 24,
          paddingTop: Platform.OS === "web" ? 80 : 40,
        }}
      >
        <View className="mb-8">
          <View className="w-1 h-8 bg-[#00FF00] mb-2" />
          <Text className="text-2xl font-bold text-white uppercase tracking-wider">
            MTEC ESTOQUE
          </Text>
          <Text className="text-sm text-gray-400 mt-1">Controle de Estoque Pro</Text>
        </View>

        <View className="bg-[#1a1a1a] rounded-lg p-6 border border-[#333]">
          <Text className="text-lg font-semibold text-white uppercase mb-6">
            {mode === "login" ? "Entrar" : "Cadastrar"}
          </Text>

          {mode === "register" && (
            <>
              <Text className="text-xs text-gray-400 mb-1">Nome (opcional)</Text>
              <TextInput
                placeholder="Seu nome"
                placeholderTextColor={colors.muted}
                value={name}
                onChangeText={setName}
                className="bg-black border border-[#333] rounded-lg px-4 py-3 text-white mb-4"
              />
            </>
          )}

          <Text className="text-xs text-gray-400 mb-1">Email *</Text>
          <TextInput
            placeholder="seu@email.com"
            placeholderTextColor={colors.muted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            className="bg-black border border-[#00FF00] rounded-lg px-4 py-3 text-white mb-4"
          />

          <Text className="text-xs text-gray-400 mb-1">Senha *</Text>
          <TextInput
            placeholder="••••••••"
            placeholderTextColor={colors.muted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            className="bg-black border border-[#333] rounded-lg px-4 py-3 text-white mb-6"
          />

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={mode === "login" ? handleLogin : handleRegister}
              disabled={isLoading}
              className="flex-1 bg-[#00FF00] rounded-lg py-3 flex-row items-center justify-center gap-2"
            >
              {isLoading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <>
                  <Text className="text-black font-bold">✓</Text>
                  <Text className="text-black font-semibold">
                    {mode === "login" ? "Entrar" : "Cadastrar"}
                  </Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMode(mode === "login" ? "register" : "login")}
              className="flex-1 bg-[#333] rounded-lg py-3 items-center justify-center"
            >
              <Text className="text-white font-semibold">
                {mode === "login" ? "Cadastrar" : "Voltar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text className="text-xs text-gray-500 text-center mt-6">
          Seus dados são privados e isolados. Outros usuários não têm acesso às suas informações.
        </Text>
      </ScrollView>
    </ScreenContainer>
  );
}
