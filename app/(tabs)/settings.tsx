import React, { useState, useCallback } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Switch,
  Alert,
  TextInput,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Settings {
  darkMode: boolean;
  defaultUnit: string;
  minimumStockAlert: string;
}

export default function SettingsScreen() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const [settings, setSettings] = useState<Settings>({
    darkMode: colorScheme === "dark",
    defaultUnit: "un",
    minimumStockAlert: "10",
  });

  useFocusEffect(
    useCallback(() => {
      loadSettings();
    }, [])
  );

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem("appSettings");
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Erro ao carregar configurações", error);
    }
  };

  const saveSettings = async (newSettings: Settings) => {
    try {
      await AsyncStorage.setItem("appSettings", JSON.stringify(newSettings));
      setSettings(newSettings);
      Alert.alert("Sucesso", "Configurações salvas!");
    } catch (error) {
      Alert.alert("Erro", "Falha ao salvar configurações");
    }
  };

  const handleClearData = () => {
    Alert.alert(
      "Atenção",
      "Isso deletará todos os dados do aplicativo. Esta ação não pode ser desfeita!",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar Tudo",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert("Sucesso", "Todos os dados foram deletados");
            } catch (error) {
              Alert.alert("Erro", "Falha ao deletar dados");
            }
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView className="flex-1 bg-background">
        {/* Header */}
        <View className="bg-primary px-6 py-6 pt-12 pb-8">
          <Text className="text-2xl font-bold text-white">Configurações</Text>
          <Text className="text-sm text-white opacity-90">Ajuste as preferências do app</Text>
        </View>

        {/* Settings Sections */}
        <View className="p-4">
          {/* Appearance */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-foreground mb-4">Aparência</Text>
            <View className="bg-surface rounded-lg p-4 border border-border">
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-foreground">Tema Escuro</Text>
                <Switch
                  value={settings.darkMode}
                  onValueChange={(value) => {
                    const newSettings = { ...settings, darkMode: value };
                    saveSettings(newSettings);
                  }}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={settings.darkMode ? colors.primary : colors.muted}
                />
              </View>
            </View>
          </View>

          {/* Defaults */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-foreground mb-4">Padrões</Text>
            <View className="bg-surface rounded-lg p-4 border border-border">
              <Text className="text-xs text-muted mb-2">Unidade Padrão</Text>
              <TextInput
                value={settings.defaultUnit}
                onChangeText={(text) => {
                  const newSettings = { ...settings, defaultUnit: text };
                  setSettings(newSettings);
                }}
                onBlur={() => saveSettings(settings)}
                placeholder="un, kg, L, etc"
                placeholderTextColor={colors.muted}
                className="bg-background border border-border rounded px-3 py-2 text-foreground text-sm"
              />
            </View>
          </View>

          {/* Alerts */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-foreground mb-4">Alertas</Text>
            <View className="bg-surface rounded-lg p-4 border border-border">
              <Text className="text-xs text-muted mb-2">Limite de Estoque Baixo</Text>
              <TextInput
                value={settings.minimumStockAlert}
                onChangeText={(text) => {
                  const newSettings = { ...settings, minimumStockAlert: text };
                  setSettings(newSettings);
                }}
                onBlur={() => saveSettings(settings)}
                placeholder="Quantidade mínima"
                placeholderTextColor={colors.muted}
                keyboardType="numeric"
                className="bg-background border border-border rounded px-3 py-2 text-foreground text-sm"
              />
              <Text className="text-xs text-muted mt-2">
                Você será alertado quando a quantidade for menor que este valor
              </Text>
            </View>
          </View>

          {/* About */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-foreground mb-4">Sobre</Text>
            <View className="bg-surface rounded-lg p-4 border border-border">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-sm text-muted">Versão</Text>
                <Text className="text-sm font-semibold text-foreground">1.0.0</Text>
              </View>
              <View className="border-t border-border pt-3">
                <Text className="text-xs text-muted">
                  Controle de Estoque Pro - Gerenciador de estoque completo para Android
                </Text>
              </View>
            </View>
          </View>

          {/* Danger Zone */}
          <View className="mb-8">
            <Text className="text-sm font-semibold text-error mb-4">Zona de Perigo</Text>
            <TouchableOpacity
              onPress={handleClearData}
              className="bg-error bg-opacity-10 rounded-lg p-4 border border-error active:opacity-80"
            >
              <Text className="text-error font-semibold text-center">🗑️ Deletar Todos os Dados</Text>
            </TouchableOpacity>
            <Text className="text-xs text-muted text-center mt-2">
              Esta ação não pode ser desfeita
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
