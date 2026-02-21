import React, { useState, useCallback } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { useFocusEffect } from "@react-navigation/native";

export default function ReportsScreen() {
  const colors = useColors();
  const [reportType, setReportType] = useState<"entrada" | "saída" | "consolidado">("consolidado");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(null);
  const [showMaterialPicker, setShowMaterialPicker] = useState(false);

  const movementsQuery = trpc.movements.list.useQuery();
  const materialsQuery = trpc.materials.list.useQuery();

  useFocusEffect(
    useCallback(() => {
      movementsQuery.refetch();
      materialsQuery.refetch();
    }, [])
  );

  const getFilteredData = () => {
    if (!movementsQuery.data) return [];

    let filtered = movementsQuery.data;

    // Filter by type
    if (reportType !== "consolidado") {
      filtered = filtered.filter((m) => m.type === reportType);
    }

    // Filter by material
    if (selectedMaterialId) {
      filtered = filtered.filter((m) => m.materialId === selectedMaterialId);
    }

    // Filter by date range
    if (startDate) {
      const start = new Date(startDate);
      filtered = filtered.filter((m) => new Date(m.movementDate) >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((m) => new Date(m.movementDate) <= end);
    }

    return filtered;
  };

  const filteredData = getFilteredData();

  const calculateTotals = () => {
    const data = filteredData;
    let entrada = 0;
    let saida = 0;

    data.forEach((m) => {
      if (m.type === "entrada") {
        entrada += m.quantity;
      } else {
        saida += m.quantity;
      }
    });

    return { entrada, saida, saldo: entrada - saida };
  };

  const totals = calculateTotals();

  const handlePrint = () => {
    Alert.alert(
      "Impressão",
      "Funcionalidade de impressão será implementada em breve",
      [{ text: "OK" }]
    );
  };

  const selectedMaterial = materialsQuery.data?.find((m) => m.id === selectedMaterialId);

  return (
    <ScreenContainer className="p-0">
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="bg-primary px-6 py-6 pt-12">
          <Text className="text-2xl font-bold text-white">Relatórios</Text>
          <Text className="text-sm text-white opacity-90">Análise de movimentações</Text>
        </View>

        {/* Filters */}
        <ScrollView className="flex-1">
          <View className="p-4">
            {/* Report Type */}
            <Text className="text-sm font-semibold text-foreground mb-3">Tipo de Relatório</Text>
            <View className="flex-row gap-2 mb-6">
              {(["consolidado", "entrada", "saída"] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setReportType(type)}
                  className={`flex-1 py-2 rounded-lg ${
                    reportType === type ? "bg-primary" : "bg-surface border border-border"
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold text-center ${
                      reportType === type ? "text-white" : "text-foreground"
                    }`}
                  >
                    {type === "consolidado" ? "Consolidado" : type === "entrada" ? "Entrada" : "Saída"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Material Filter */}
            <Text className="text-sm font-semibold text-foreground mb-2">Filtrar por Material</Text>
            <TouchableOpacity
              onPress={() => setShowMaterialPicker(true)}
              className="bg-surface border border-border rounded-lg px-4 py-3 mb-6"
            >
              <Text className="text-foreground">
                {selectedMaterial ? selectedMaterial.name : "Todos os materiais"}
              </Text>
            </TouchableOpacity>

            {selectedMaterial && (
              <TouchableOpacity
                onPress={() => setSelectedMaterialId(null)}
                className="bg-error bg-opacity-10 rounded-lg px-3 py-2 mb-6 border border-error"
              >
                <Text className="text-error text-xs font-semibold text-center">Limpar Filtro</Text>
              </TouchableOpacity>
            )}

            {/* Date Range */}
            <Text className="text-sm font-semibold text-foreground mb-2">Data Inicial</Text>
            <TextInput
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.muted}
              value={startDate}
              onChangeText={setStartDate}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground mb-4"
            />

            <Text className="text-sm font-semibold text-foreground mb-2">Data Final</Text>
            <TextInput
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.muted}
              value={endDate}
              onChangeText={setEndDate}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground mb-6"
            />

            {/* Totals */}
            <View className="bg-surface rounded-lg p-4 border border-border mb-6">
              <Text className="text-sm font-semibold text-foreground mb-3">Resumo</Text>
              <View className="flex-row justify-between mb-2">
                <Text className="text-sm text-muted">Entradas:</Text>
                <Text className="text-sm font-bold text-success">+{totals.entrada}</Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-sm text-muted">Saídas:</Text>
                <Text className="text-sm font-bold text-error">-{totals.saida}</Text>
              </View>
              <View className="border-t border-border pt-2 flex-row justify-between">
                <Text className="text-sm font-semibold text-foreground">Saldo:</Text>
                <Text
                  className={`text-sm font-bold ${
                    totals.saldo >= 0 ? "text-success" : "text-error"
                  }`}
                >
                  {totals.saldo >= 0 ? "+" : ""}{totals.saldo}
                </Text>
              </View>
            </View>

            {/* Print Button */}
            <TouchableOpacity
              onPress={handlePrint}
              className="bg-primary rounded-lg py-3 mb-6 active:opacity-80"
            >
              <Text className="text-white font-semibold text-center">🖨️ Imprimir Relatório</Text>
            </TouchableOpacity>
          </View>

          {/* Movements List */}
          {movementsQuery.isLoading ? (
            <View className="flex-1 justify-center items-center py-8">
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : filteredData.length > 0 ? (
            <View className="px-4 pb-8">
              <Text className="text-sm font-semibold text-foreground mb-3">
                Movimentações ({filteredData.length})
              </Text>
              {filteredData.map((movement) => {
                const material = materialsQuery.data?.find((m) => m.id === movement.materialId);
                return (
                  <View
                    key={movement.id}
                    className="bg-surface rounded-lg p-4 mb-2 border border-border"
                  >
                    <View className="flex-row justify-between items-start mb-2">
                      <View className="flex-1">
                        <Text className="text-sm font-semibold text-foreground">
                          {material?.name || "Material desconhecido"}
                        </Text>
                        <Text className="text-xs text-muted mt-1">
                          {new Date(movement.movementDate).toLocaleDateString("pt-BR")}
                        </Text>
                      </View>
                      <Text
                        className={`text-base font-bold ${
                          movement.type === "entrada" ? "text-success" : "text-error"
                        }`}
                      >
                        {movement.type === "entrada" ? "+" : "-"}{movement.quantity}
                      </Text>
                    </View>
                    {movement.reason && (
                      <Text className="text-xs text-muted">Motivo: {movement.reason}</Text>
                    )}
                  </View>
                );
              })}
            </View>
          ) : (
            <View className="flex-1 justify-center items-center py-8 px-4">
              <Text className="text-muted text-center">Nenhuma movimentação encontrada</Text>
            </View>
          )}
        </ScrollView>

        {/* Material Picker Modal */}
        <Modal visible={showMaterialPicker} animationType="slide" transparent>
          <View className="flex-1 bg-black bg-opacity-50 justify-end">
            <View className="bg-background rounded-t-2xl p-6 pb-12 max-h-96">
              <Text className="text-xl font-bold text-foreground mb-4">Selecionar Material</Text>
              <FlatList
                data={materialsQuery.data || []}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedMaterialId(item.id);
                      setShowMaterialPicker(false);
                    }}
                    className={`p-4 rounded-lg mb-2 border ${
                      selectedMaterialId === item.id
                        ? "bg-primary border-primary"
                        : "bg-surface border-border"
                    }`}
                  >
                    <Text
                      className={`font-semibold ${
                        selectedMaterialId === item.id ? "text-white" : "text-foreground"
                      }`}
                    >
                      {item.name}
                    </Text>
                    <Text
                      className={`text-xs mt-1 ${
                        selectedMaterialId === item.id ? "text-white opacity-80" : "text-muted"
                      }`}
                    >
                      Saldo: {item.quantity} {item.unit}
                    </Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                onPress={() => setShowMaterialPicker(false)}
                className="bg-muted rounded-lg py-3 mt-4 active:opacity-80"
              >
                <Text className="text-white font-semibold text-center">Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ScreenContainer>
  );
}
