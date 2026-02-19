import React, { useCallback, useState, useEffect } from "react";
import { ScrollView, Text, View, TouchableOpacity, FlatList, ActivityIndicator, TextInput, Modal } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { useFocusEffect } from "@react-navigation/native";

interface StatCard {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

export default function HomeScreen() {
  const colors = useColors();
  const [stats, setStats] = useState<StatCard[]>([]);
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: 1,
    quantity: "0",
    unit: "un",
    unitPrice: "0.00",
    minimumStock: "0",
  });
  
  const materialsQuery = trpc.materials.list.useQuery();
  const movementsQuery = trpc.movements.list.useQuery();
  const categoriesQuery = trpc.categories.list.useQuery();
  const createMutation = trpc.materials.create.useMutation();

  useFocusEffect(
    useCallback(() => {
      materialsQuery.refetch();
      movementsQuery.refetch();
      categoriesQuery.refetch();
    }, [])
  );

  // Calculate stats
  useEffect(() => {
    if (materialsQuery.data && movementsQuery.data && categoriesQuery.data) {
      const totalMaterials = materialsQuery.data.length;
      const totalQuantity = materialsQuery.data.reduce((sum, m) => sum + (m.quantity || 0), 0);
      const lowStockCount = materialsQuery.data.filter(
        m => m.minimumStock && m.quantity < m.minimumStock
      ).length;

      setStats([
        {
          title: "Total de Materiais",
          value: totalMaterials,
          icon: "📦",
          color: colors.primary,
        },
        {
          title: "Quantidade Total",
          value: totalQuantity,
          icon: "📊",
          color: colors.success,
        },
        {
          title: "Estoque Baixo",
          value: lowStockCount,
          icon: "⚠️",
          color: colors.warning,
        },
        {
          title: "Categorias",
          value: categoriesQuery.data.length,
          icon: "🏷️",
          color: colors.primary,
        },
      ]);
    }
  }, [materialsQuery.data, movementsQuery.data, categoriesQuery.data]);

  const handleAddMaterial = async () => {
    if (!formData.name.trim()) {
      alert("Nome do material é obrigatório");
      return;
    }

    try {
      await createMutation.mutateAsync({
        name: formData.name,
        description: formData.description,
        categoryId: formData.categoryId,
        quantity: parseInt(formData.quantity) || 0,
        unit: formData.unit,
        unitPrice: formData.unitPrice,
        minimumStock: parseInt(formData.minimumStock) || 0,
      });

      setShowAddMaterialModal(false);
      setFormData({
        name: "",
        description: "",
        categoryId: 1,
        quantity: "0",
        unit: "un",
        unitPrice: "0.00",
        minimumStock: "0",
      });

      materialsQuery.refetch();
    } catch (error) {
      alert("Falha ao adicionar material");
    }
  };

  const isLoading = materialsQuery.isLoading || movementsQuery.isLoading || categoriesQuery.isLoading;

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
        {/* Header */}
        <View className="bg-primary px-6 py-8 pt-12">
          <Text className="text-3xl font-bold text-white mb-2">Controle de Estoque</Text>
          <Text className="text-sm text-white opacity-90">Bem-vindo ao seu gerenciador</Text>
        </View>

        {/* Stats Grid */}
        <View className="px-4 py-6">
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <View className="gap-3">
              {stats.map((stat, index) => (
                <View
                  key={index}
                  className="bg-surface rounded-lg p-4 border border-border flex-row items-center justify-between"
                >
                  <View className="flex-1">
                    <Text className="text-xs text-muted mb-1">{stat.title}</Text>
                    <Text className="text-2xl font-bold text-foreground">{stat.value}</Text>
                  </View>
                  <Text className="text-3xl">{stat.icon}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View className="px-4 py-4">
          <Text className="text-sm font-semibold text-foreground mb-3">Ações Rápidas</Text>
          <View className="gap-2">
            <TouchableOpacity className="bg-primary rounded-lg py-3 px-4 active:opacity-80">
              <Text className="text-white font-semibold text-center">+ Entrada de Material</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-error rounded-lg py-3 px-4 active:opacity-80">
              <Text className="text-white font-semibold text-center">- Saída de Material</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setShowAddMaterialModal(true)}
              className="bg-success rounded-lg py-3 px-4 active:opacity-80"
            >
              <Text className="text-white font-semibold text-center">+ Cadastrar Material</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Products with Available Balance */}
        <View className="px-4 pb-6">
          <Text className="text-sm font-semibold text-foreground mb-3">Produtos em Estoque</Text>
          {materialsQuery.data && materialsQuery.data.length > 0 ? (
            <View className="gap-2">
              {materialsQuery.data.slice(0, 10).map((material) => (
                <View
                  key={material.id}
                  className="bg-surface rounded-lg p-3 border border-border"
                >
                  <View className="flex-row justify-between items-start mb-1">
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-foreground">{material.name}</Text>
                      {material.description && (
                        <Text className="text-xs text-muted mt-0.5">{material.description}</Text>
                      )}
                    </View>
                  </View>
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center gap-2">
                      <View>
                        <Text className="text-xs text-muted">Saldo</Text>
                        <Text className={`text-base font-bold ${
                          material.quantity < (material.minimumStock || 0) ? "text-error" : "text-success"
                        }`}>
                          {material.quantity} {material.unit}
                        </Text>
                      </View>
                    </View>
                    <View className="items-end">
                      <Text className="text-xs text-muted">Preço Unit.</Text>
                      <Text className="text-sm font-semibold text-foreground">
                        R$ {parseFloat(material.unitPrice || "0").toFixed(2)}
                      </Text>
                    </View>
                  </View>
                  {material.minimumStock && material.quantity < material.minimumStock && (
                    <View className="mt-2 bg-warning bg-opacity-20 rounded px-2 py-1">
                      <Text className="text-xs text-warning font-semibold">
                        ⚠️ Estoque baixo (mín: {material.minimumStock})
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <Text className="text-sm text-muted text-center py-4">Nenhum produto em estoque</Text>
          )}
        </View>

        {/* Recent Movements */}
        <View className="px-4 pb-6">
          <Text className="text-sm font-semibold text-foreground mb-3">Movimentações Recentes</Text>
          {movementsQuery.data && movementsQuery.data.length > 0 ? (
            <View className="gap-2">
              {movementsQuery.data.slice(0, 5).map((movement) => (
                <View
                  key={movement.id}
                  className="bg-surface rounded-lg p-3 border border-border flex-row items-center justify-between"
                >
                  <View className="flex-1">
                    <Text className="text-xs text-muted mb-1">
                      {movement.type === "entrada" ? "Entrada" : "Saída"}
                    </Text>
                    <Text className="text-sm font-medium text-foreground">
                      {movement.quantity} unidades
                    </Text>
                  </View>
                  <Text
                    className={`text-sm font-semibold ${
                      movement.type === "entrada" ? "text-success" : "text-error"
                    }`}
                  >
                    {movement.type === "entrada" ? "+" : "-"}{movement.quantity}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text className="text-sm text-muted text-center py-4">Nenhuma movimentação registrada</Text>
          )}
        </View>

        {/* Add Material Modal */}
        <Modal visible={showAddMaterialModal} animationType="slide" transparent>
          <View className="flex-1 bg-black bg-opacity-50 justify-end">
            <View className="bg-background rounded-t-2xl p-6 pb-12">
              <Text className="text-xl font-bold text-foreground mb-6">Novo Material</Text>

              <Text className="text-xs font-semibold text-muted mb-1">Nome do Material *</Text>
              <TextInput
                placeholder="Ex: Parafuso M8"
                placeholderTextColor={colors.muted}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground mb-4"
              />

              <Text className="text-xs font-semibold text-muted mb-1">Descrição</Text>
              <TextInput
                placeholder="Ex: Parafuso de aço inoxidável"
                placeholderTextColor={colors.muted}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground mb-4"
                multiline
              />

              <Text className="text-xs font-semibold text-muted mb-1">Quantidade Inicial</Text>
              <TextInput
                placeholder="0"
                placeholderTextColor={colors.muted}
                value={formData.quantity}
                onChangeText={(text) => setFormData({ ...formData, quantity: text })}
                keyboardType="numeric"
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground mb-4"
              />

              <Text className="text-xs font-semibold text-muted mb-1">Unidade de Medida</Text>
              <TextInput
                placeholder="Ex: un, kg, L, m"
                placeholderTextColor={colors.muted}
                value={formData.unit}
                onChangeText={(text) => setFormData({ ...formData, unit: text })}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground mb-4"
              />

              <Text className="text-xs font-semibold text-muted mb-1">Preço Unitário (R$)</Text>
              <TextInput
                placeholder="0.00"
                placeholderTextColor={colors.muted}
                value={formData.unitPrice}
                onChangeText={(text) => setFormData({ ...formData, unitPrice: text })}
                keyboardType="decimal-pad"
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground mb-4"
              />

              <Text className="text-xs font-semibold text-muted mb-1">Estoque Mínimo (Alerta)</Text>
              <TextInput
                placeholder="Ex: 10"
                placeholderTextColor={colors.muted}
                value={formData.minimumStock}
                onChangeText={(text) => setFormData({ ...formData, minimumStock: text })}
                keyboardType="numeric"
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground mb-6"
              />

              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => setShowAddMaterialModal(false)}
                  className="flex-1 bg-muted rounded-lg py-3 active:opacity-80"
                >
                  <Text className="text-white font-semibold text-center">Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleAddMaterial}
                  disabled={createMutation.isPending}
                  className="flex-1 bg-primary rounded-lg py-3 active:opacity-80"
                >
                  <Text className="text-white font-semibold text-center">
                    {createMutation.isPending ? "Salvando..." : "Salvar"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </ScreenContainer>
  );
}
