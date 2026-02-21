import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, FlatList, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { useFocusEffect } from "@react-navigation/native";

export default function WebScreen() {
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<"dashboard" | "materiais" | "movimentacoes" | "relatorios">("dashboard");
  const [searchText, setSearchText] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const materialsQuery = trpc.materials.list.useQuery();
  const movementsQuery = trpc.movements.list.useQuery();
  const categoriesQuery = trpc.categories.list.useQuery();

  useFocusEffect(
    useCallback(() => {
      materialsQuery.refetch();
      movementsQuery.refetch();
      categoriesQuery.refetch();
    }, [])
  );

  const filteredMaterials = materialsQuery.data?.filter((m) =>
    m.name.toLowerCase().includes(searchText.toLowerCase())
  ) || [];

  const totalQuantity = materialsQuery.data?.reduce((sum, m) => sum + m.quantity, 0) || 0;
  const lowStockCount = materialsQuery.data?.filter(
    (m) => m.minimumStock && m.quantity < m.minimumStock
  ).length || 0;

  return (
    <ScreenContainer className="p-0">
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="bg-primary px-6 py-6 pt-12">
          <Text className="text-3xl font-bold text-black">MTec Estoque</Text>
          <Text className="text-sm text-black opacity-80">Versão Web</Text>
        </View>

        {/* Navigation Tabs */}
        <View className="flex-row bg-surface border-b border-border">
          {(["dashboard", "materiais", "movimentacoes", "relatorios"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`flex-1 py-4 items-center ${
                activeTab === tab ? "border-b-2 border-primary" : ""
              }`}
            >
              <Text
                className={`font-semibold text-xs ${
                  activeTab === tab ? "text-primary" : "text-muted"
                }`}
              >
                {tab === "dashboard"
                  ? "📊 Dashboard"
                  : tab === "materiais"
                  ? "📦 Materiais"
                  : tab === "movimentacoes"
                  ? "🔄 Movimentações"
                  : "📄 Relatórios"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
          {activeTab === "dashboard" && (
            <View className="gap-4">
              <Text className="text-2xl font-bold text-foreground mb-4">Dashboard</Text>

              <View className="bg-primary rounded-lg p-6">
                <Text className="text-sm text-black opacity-80">Total de Materiais</Text>
                <Text className="text-4xl font-bold text-black">
                  {materialsQuery.data?.length || 0}
                </Text>
              </View>

              <View className="bg-success bg-opacity-20 rounded-lg p-6 border border-success">
                <Text className="text-sm text-success font-semibold">Quantidade Total em Estoque</Text>
                <Text className="text-4xl font-bold text-success">{totalQuantity}</Text>
              </View>

              <View className="bg-warning bg-opacity-20 rounded-lg p-6 border border-warning">
                <Text className="text-sm text-warning font-semibold">Estoque Baixo</Text>
                <Text className="text-4xl font-bold text-warning">{lowStockCount}</Text>
              </View>

              <View className="bg-surface rounded-lg p-6 border border-border">
                <Text className="text-sm text-foreground font-semibold mb-2">Últimas Movimentações</Text>
                {movementsQuery.data?.slice(0, 5).map((m) => {
                  const material = materialsQuery.data?.find((mat) => mat.id === m.materialId);
                  return (
                    <View key={m.id} className="flex-row justify-between py-2 border-b border-border">
                      <Text className="text-xs text-foreground">{material?.name}</Text>
                      <Text
                        className={`text-xs font-semibold ${
                          m.type === "entrada" ? "text-success" : "text-error"
                        }`}
                      >
                        {m.type === "entrada" ? "+" : "-"}{m.quantity}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {activeTab === "materiais" && (
            <View className="gap-4">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-2xl font-bold text-foreground">Materiais</Text>
                <TouchableOpacity
                  onPress={() => setShowAddModal(true)}
                  className="bg-primary rounded-lg px-4 py-2"
                >
                  <Text className="text-black font-semibold text-sm">+ Novo</Text>
                </TouchableOpacity>
              </View>

              <TextInput
                placeholder="Buscar material..."
                placeholderTextColor={colors.muted}
                value={searchText}
                onChangeText={setSearchText}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground mb-4"
              />

              {filteredMaterials.map((material) => (
                <View
                  key={material.id}
                  className="bg-surface rounded-lg p-4 border border-border flex-row justify-between items-center"
                >
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-foreground">{material.name}</Text>
                    <Text className="text-xs text-muted mt-1">
                      {material.quantity} {material.unit}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-xs text-muted">R$</Text>
                    <Text className="text-sm font-semibold text-foreground">
                      {parseFloat(material.unitPrice || "0").toFixed(2)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {activeTab === "movimentacoes" && (
            <View className="gap-4">
              <Text className="text-2xl font-bold text-foreground mb-4">Movimentações</Text>
              {movementsQuery.data?.map((movement) => {
                const material = materialsQuery.data?.find((m) => m.id === movement.materialId);
                return (
                  <View
                    key={movement.id}
                    className={`rounded-lg p-4 border ${
                      movement.type === "entrada"
                        ? "bg-success bg-opacity-10 border-success"
                        : "bg-error bg-opacity-10 border-error"
                    }`}
                  >
                    <View className="flex-row justify-between items-start">
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-foreground">
                          {material?.name}
                        </Text>
                        <Text className="text-xs text-muted mt-1">
                          {new Date(movement.movementDate).toLocaleDateString("pt-BR")}
                        </Text>
                      </View>
                      <Text
                        className={`text-lg font-bold ${
                          movement.type === "entrada" ? "text-success" : "text-error"
                        }`}
                      >
                        {movement.type === "entrada" ? "+" : "-"}{movement.quantity}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {activeTab === "relatorios" && (
            <View className="gap-4">
              <Text className="text-2xl font-bold text-foreground mb-4">Relatórios</Text>
              <View className="bg-surface rounded-lg p-6 border border-border">
                <Text className="text-base font-semibold text-foreground mb-4">Opções de Exportação</Text>
                <TouchableOpacity className="bg-primary rounded-lg py-3 mb-2 active:opacity-80">
                  <Text className="text-black font-semibold text-center">📄 Gerar PDF</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-success rounded-lg py-3 active:opacity-80">
                  <Text className="text-black font-semibold text-center">📊 Exportar CSV</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
