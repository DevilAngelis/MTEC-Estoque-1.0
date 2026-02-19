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

export default function MovementsScreen() {
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<"entrada" | "saída">("entrada");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    materialId: "1",
    quantity: "",
    reason: "",
    notes: "",
  });

  const movementsQuery = trpc.movements.list.useQuery();
  const materialsQuery = trpc.materials.list.useQuery();
  const createMutation = trpc.movements.create.useMutation();
  const deleteMutation = trpc.movements.delete.useMutation();

  useFocusEffect(
    useCallback(() => {
      movementsQuery.refetch();
      materialsQuery.refetch();
    }, [])
  );

  const filteredMovements = movementsQuery.data?.filter((m) => m.type === activeTab) || [];

  const handleAddMovement = async () => {
    if (!formData.quantity.trim()) {
      Alert.alert("Erro", "Quantidade é obrigatória");
      return;
    }

    try {
      await createMutation.mutateAsync({
        materialId: parseInt(formData.materialId),
        type: activeTab,
        quantity: parseInt(formData.quantity),
        reason: formData.reason,
        notes: formData.notes,
        movementDate: new Date(),
      });

      setShowModal(false);
      setFormData({
        materialId: "1",
        quantity: "",
        reason: "",
        notes: "",
      });

      movementsQuery.refetch();
      materialsQuery.refetch();
      Alert.alert("Sucesso", `${activeTab === "entrada" ? "Entrada" : "Saída"} registrada!`);
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Falha ao registrar movimentação");
    }
  };

  const handleDeleteMovement = (id: number, type: string, quantity: number) => {
    Alert.alert(
      "Confirmar exclusão",
      `Deseja deletar esta movimentação de ${type}? O estoque será revertido em ${quantity} unidades.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteMutation.mutateAsync({ id });
              movementsQuery.refetch();
              materialsQuery.refetch();
              Alert.alert("Sucesso", "Movimentação deletada e estoque revertido!");
            } catch (error: any) {
              Alert.alert("Erro", error.message || "Falha ao deletar movimentação");
            }
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer className="p-0">
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="bg-primary px-6 py-6 pt-12">
          <Text className="text-2xl font-bold text-black">Movimentações</Text>
          <Text className="text-sm text-black opacity-80">Entrada e saída de materiais</Text>
        </View>

        {/* Tabs */}
        <View className="flex-row bg-surface border-b border-border">
          <TouchableOpacity
            onPress={() => setActiveTab("entrada")}
            className={`flex-1 py-4 items-center ${
              activeTab === "entrada" ? "border-b-2 border-success" : ""
            }`}
          >
            <Text
              className={`font-semibold ${
                activeTab === "entrada" ? "text-success" : "text-muted"
              }`}
            >
              📥 Entrada
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("saída")}
            className={`flex-1 py-4 items-center ${
              activeTab === "saída" ? "border-b-2 border-error" : ""
            }`}
          >
            <Text
              className={`font-semibold ${
                activeTab === "saída" ? "text-error" : "text-muted"
              }`}
            >
              📤 Saída
            </Text>
          </TouchableOpacity>
        </View>

        {/* Movements List */}
        {movementsQuery.isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : filteredMovements.length > 0 ? (
          <FlatList
            data={filteredMovements}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16, paddingBottom: 100 }}
            renderItem={({ item }) => {
              const material = materialsQuery.data?.find((m) => m.id === item.materialId);
              return (
                <View className="bg-surface rounded-lg p-4 mb-3 border border-border">
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-foreground">
                        {material?.name || "Material desconhecido"}
                      </Text>
                      <Text className="text-xs text-muted mt-1">
                        {new Date(item.movementDate).toLocaleDateString("pt-BR")}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <Text
                        className={`text-lg font-bold ${
                          item.type === "entrada" ? "text-success" : "text-error"
                        }`}
                      >
                        {item.type === "entrada" ? "+" : "-"}{item.quantity}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleDeleteMovement(item.id, item.type, item.quantity)}
                      >
                        <Text className="text-error font-bold text-lg">✕</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {item.reason && (
                    <Text className="text-xs text-muted mb-1">Motivo: {item.reason}</Text>
                  )}
                  {item.notes && (
                    <Text className="text-xs text-muted">Obs: {item.notes}</Text>
                  )}
                </View>
              );
            }}
          />
        ) : (
          <View className="flex-1 justify-center items-center px-4">
            <Text className="text-muted text-center">
              Nenhuma {activeTab === "entrada" ? "entrada" : "saída"} registrada
            </Text>
          </View>
        )}

        {/* Add Button */}
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          className="absolute bottom-6 right-6 bg-primary rounded-full w-14 h-14 justify-center items-center shadow-lg"
        >
          <Text className="text-black text-2xl font-bold">+</Text>
        </TouchableOpacity>

        {/* Add Modal */}
        <Modal visible={showModal} animationType="slide" transparent>
          <View className="flex-1 bg-black bg-opacity-50 justify-end">
            <View className="bg-background rounded-t-2xl p-6 pb-12">
              <Text className="text-xl font-bold text-foreground mb-6">
                Nova {activeTab === "entrada" ? "Entrada" : "Saída"}
              </Text>

              <Text className="text-sm font-semibold text-foreground mb-2">Material *</Text>
              <TouchableOpacity
                className="bg-surface border border-border rounded-lg px-4 py-3 mb-3"
                onPress={() => {
                  const selected = materialsQuery.data?.[0];
                  if (selected) {
                    setFormData({ ...formData, materialId: selected.id.toString() });
                  }
                }}
              >
                <Text className="text-foreground">
                  {materialsQuery.data?.find((m) => m.id.toString() === formData.materialId)?.name ||
                    "Selecionar material"}
                </Text>
              </TouchableOpacity>

              <TextInput
                placeholder="Quantidade *"
                placeholderTextColor={colors.muted}
                value={formData.quantity}
                onChangeText={(text) => setFormData({ ...formData, quantity: text })}
                keyboardType="numeric"
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground mb-3"
              />

              <TextInput
                placeholder="Motivo"
                placeholderTextColor={colors.muted}
                value={formData.reason}
                onChangeText={(text) => setFormData({ ...formData, reason: text })}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground mb-3"
              />

              <TextInput
                placeholder="Observações"
                placeholderTextColor={colors.muted}
                value={formData.notes}
                onChangeText={(text) => setFormData({ ...formData, notes: text })}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground mb-6"
                multiline
              />

              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => setShowModal(false)}
                  className="flex-1 bg-muted rounded-lg py-3 active:opacity-80"
                >
                  <Text className="text-white font-semibold text-center">Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleAddMovement}
                  disabled={createMutation.isPending}
                  className="flex-1 bg-primary rounded-lg py-3 active:opacity-80"
                >
                  <Text className="text-black font-semibold text-center">
                    {createMutation.isPending ? "Registrando..." : "Registrar"}
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
