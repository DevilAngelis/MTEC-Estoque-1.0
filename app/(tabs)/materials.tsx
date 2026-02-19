import React, { useState, useCallback } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { useFocusEffect } from "@react-navigation/native";

export default function MaterialsScreen() {
  const colors = useColors();
  const [searchText, setSearchText] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
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
  const categoriesQuery = trpc.categories.list.useQuery();
  const movementsQuery = trpc.movements.list.useQuery();
  const createMutation = trpc.materials.create.useMutation();
  const deleteMutation = trpc.materials.delete.useMutation();

  useFocusEffect(
    useCallback(() => {
      materialsQuery.refetch();
      categoriesQuery.refetch();
      movementsQuery.refetch();
    }, [])
  );

  const filteredMaterials = materialsQuery.data?.filter((m) =>
    m.name.toLowerCase().includes(searchText.toLowerCase())
  ) || [];

  const handleAddMaterial = async () => {
    if (!formData.name.trim()) {
      Alert.alert("Erro", "Nome do material é obrigatório");
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

      setShowAddModal(false);
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
      Alert.alert("Sucesso", "Material adicionado com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Falha ao adicionar material");
    }
  };

  const handleDeleteMaterial = (id: number, name: string) => {
    // Verificar se o material tem movimentações
    const hasMov = movementsQuery.data?.some(m => m.materialId === id);

    if (hasMov) {
      Alert.alert(
        "Não é possível deletar",
        `O material "${name}" possui movimentações registradas (entrada/saída). Você não pode deletar materiais que já foram movimentados.`
      );
      return;
    }

    Alert.alert("Confirmar", `Deseja deletar "${name}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Deletar",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteMutation.mutateAsync({ id });
            materialsQuery.refetch();
            Alert.alert("Sucesso", "Material deletado!");
          } catch (error) {
            Alert.alert("Erro", "Falha ao deletar material");
          }
        },
      },
    ]);
  };

  return (
    <ScreenContainer className="p-0">
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="bg-primary px-6 py-6 pt-12">
          <Text className="text-2xl font-bold text-black">Materiais</Text>
          <Text className="text-sm text-black opacity-80">Gerenciar estoque</Text>
        </View>

        {/* Search Bar */}
        <View className="px-4 py-4">
          <TextInput
            placeholder="Buscar material..."
            placeholderTextColor={colors.muted}
            value={searchText}
            onChangeText={setSearchText}
            className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
          />
        </View>

        {/* Materials List */}
        {materialsQuery.isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : filteredMaterials.length > 0 ? (
          <FlatList
            data={filteredMaterials}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
            renderItem={({ item }) => {
              const hasMov = movementsQuery.data?.some(m => m.materialId === item.id);
              return (
                <View className="bg-surface rounded-lg p-4 mb-3 border border-border">
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-foreground">{item.name}</Text>
                      {item.description && (
                        <Text className="text-xs text-muted mt-1">{item.description}</Text>
                      )}
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDeleteMaterial(item.id, item.name)}
                      disabled={hasMov}
                      className={`ml-2 ${hasMov ? "opacity-30" : ""}`}
                    >
                      <Text className={`font-bold ${hasMov ? "text-muted" : "text-error"}`}>✕</Text>
                    </TouchableOpacity>
                  </View>
                  <View className="flex-row justify-between items-center">
                    <View>
                      <Text className="text-xs text-muted">Quantidade</Text>
                      <Text className="text-lg font-bold text-foreground">
                        {item.quantity} {item.unit}
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-xs text-muted">Preço Unit.</Text>
                      <Text className="text-sm font-semibold text-foreground">
                        R$ {parseFloat(item.unitPrice || "0").toFixed(2)}
                      </Text>
                    </View>
                  </View>
                  {item.minimumStock && item.quantity < item.minimumStock && (
                    <View className="mt-2 bg-warning bg-opacity-20 rounded px-2 py-1">
                      <Text className="text-xs text-warning font-semibold">
                        ⚠️ Estoque baixo
                      </Text>
                    </View>
                  )}
                  {hasMov && (
                    <View className="mt-2 bg-primary bg-opacity-10 rounded px-2 py-1">
                      <Text className="text-xs text-primary font-semibold">
                        🔒 Bloqueado (tem movimentações)
                      </Text>
                    </View>
                  )}
                </View>
              );
            }}
          />
        ) : (
          <View className="flex-1 justify-center items-center px-4">
            <Text className="text-muted text-center">Nenhum material encontrado</Text>
          </View>
        )}

        {/* Add Button */}
        <TouchableOpacity
          onPress={() => setShowAddModal(true)}
          className="absolute bottom-6 right-6 bg-primary rounded-full w-14 h-14 justify-center items-center shadow-lg"
        >
          <Text className="text-black text-2xl font-bold">+</Text>
        </TouchableOpacity>

        {/* Add Modal */}
        <Modal visible={showAddModal} animationType="slide" transparent>
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

              <Text className="text-xs font-semibold text-muted mb-1">Descrição do Produto</Text>
              <TextInput
                placeholder="Ex: Parafuso de aço inoxidável"
                placeholderTextColor={colors.muted}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground mb-4"
                multiline
              />

              <Text className="text-xs font-semibold text-muted mb-1">Quantidade Inicial em Estoque</Text>
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
                placeholder="Ex: un (unidade), kg (quilograma), L (litro), m (metro)"
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

              <Text className="text-xs font-semibold text-muted mb-1">Quantidade Mínima para Alerta</Text>
              <TextInput
                placeholder="Ex: 10 (você será alertado quando a quantidade for menor que isso)"
                placeholderTextColor={colors.muted}
                value={formData.minimumStock}
                onChangeText={(text) => setFormData({ ...formData, minimumStock: text })}
                keyboardType="numeric"
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground mb-6"
              />

              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => setShowAddModal(false)}
                  className="flex-1 bg-muted rounded-lg py-3 active:opacity-80"
                >
                  <Text className="text-white font-semibold text-center">Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleAddMaterial}
                  disabled={createMutation.isPending}
                  className="flex-1 bg-primary rounded-lg py-3 active:opacity-80"
                >
                  <Text className="text-black font-semibold text-center">
                    {createMutation.isPending ? "Salvando..." : "Salvar Material"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScreenContainer>
  );
}
