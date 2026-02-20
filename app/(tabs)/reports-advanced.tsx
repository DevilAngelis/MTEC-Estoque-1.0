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
  Share,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { useFocusEffect } from "@react-navigation/native";
import * as Print from "expo-print";
// @ts-ignore - Legacy API for compatibility
import * as FileSystem from "expo-file-system/legacy";

export default function ReportsAdvancedScreen() {
  const colors = useColors();
  const [reportType, setReportType] = useState<"entrada" | "saida" | "consolidado">("consolidado");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const movementsQuery = trpc.movements.list.useQuery();
  const materialsQuery = trpc.materials.list.useQuery();
  const reportQuery = trpc.reports.generatePDF.useQuery(
    {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      materialId: selectedMaterialId || undefined,
      type: reportType as any,
    },
    { enabled: false }
  );
  const csvQuery = trpc.reports.exportCSV.useQuery(
    {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      materialId: selectedMaterialId || undefined,
      type: reportType as any,
    },
    { enabled: false }
  );

  useFocusEffect(
    useCallback(() => {
      movementsQuery.refetch();
      materialsQuery.refetch();
    }, [])
  );

  const selectedMaterial = materialsQuery.data?.find((m) => m.id === selectedMaterialId);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      const data = await reportQuery.refetch();
      if (!data.data) throw new Error("Falha ao gerar relatório");

      const htmlContent = generateHTMLReport(data.data);
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      
      // Copiar para Downloads
      const filename = `relatorio_${new Date().getTime()}.pdf`;
      const downloadPath = `${FileSystem.documentDirectory}${filename}`;
      await FileSystem.copyAsync({ from: uri, to: downloadPath });

      Alert.alert(
        "Sucesso",
        `Relatório gerado: ${filename}\n\nCaminho: ${downloadPath}`,
        [{ text: "OK" }]
      );
    } catch (error) {
      Alert.alert("Erro", "Falha ao gerar PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportCSV = async () => {
    setIsGenerating(true);
    try {
      const data = await csvQuery.refetch();
      if (!data.data?.csv) throw new Error("Falha ao exportar CSV");

      const filename = `relatorio_${new Date().getTime()}.csv`;
      const path = `${FileSystem.documentDirectory}${filename}`;
      await FileSystem.writeAsStringAsync(path, data.data.csv);

      Alert.alert(
        "Sucesso",
        `Arquivo exportado: ${filename}`,
        [{ text: "OK" }]
      );
    } catch (error) {
      Alert.alert("Erro", "Falha ao exportar CSV");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ScreenContainer className="p-0">
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="bg-primary px-6 py-6 pt-12">
          <Text className="text-2xl font-bold text-black">Relatórios Avançados</Text>
          <Text className="text-sm text-black opacity-80">PDF e Exportação</Text>
        </View>

        <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
          {/* Report Type */}
          <Text className="text-sm font-semibold text-foreground mb-3">Tipo de Relatório</Text>
          <View className="flex-row gap-2 mb-6">
            {(["consolidado", "entrada", "saida"] as const).map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setReportType(type)}
                className={`flex-1 py-2 rounded-lg ${
                  reportType === type ? "bg-primary" : "bg-surface border border-border"
                }`}
              >
                <Text
                  className={`text-xs font-semibold text-center ${
                    reportType === type ? "text-black" : "text-foreground"
                  }`}
                >
                  {type === "consolidado" ? "Consolidado" : type === "entrada" ? "Entrada" : "Saída"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Material Filter */}
          <Text className="text-sm font-semibold text-foreground mb-2">Material</Text>
          <TouchableOpacity
            onPress={() => setSelectedMaterialId(null)}
            className={`bg-surface border rounded-lg px-4 py-3 mb-4 ${
              selectedMaterialId ? "border-border" : "border-primary"
            }`}
          >
            <Text className="text-foreground">
              {selectedMaterial ? selectedMaterial.name : "Todos os materiais"}
            </Text>
          </TouchableOpacity>

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

          {/* Action Buttons */}
          <View className="gap-3 mb-6">
            <TouchableOpacity
              onPress={handleGeneratePDF}
              disabled={isGenerating}
              className="bg-primary rounded-lg py-4 active:opacity-80"
            >
              <Text className="text-black font-semibold text-center">
                {isGenerating ? "Gerando..." : "📄 Gerar PDF"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleExportCSV}
              disabled={isGenerating}
              className="bg-success rounded-lg py-4 active:opacity-80"
            >
              <Text className="text-black font-semibold text-center">
                {isGenerating ? "Exportando..." : "📊 Exportar CSV"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Preview */}
          <Text className="text-sm font-semibold text-foreground mb-3">Prévia do Relatório</Text>
          <View className="bg-surface rounded-lg p-4 border border-border">
            <Text className="text-xs text-muted mb-2">Movimentações encontradas: {movementsQuery.data?.length || 0}</Text>
            <Text className="text-xs text-muted">Materiais: {materialsQuery.data?.length || 0}</Text>
          </View>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}

function generateHTMLReport(data: any) {
  const { movements, materials, totals, generatedAt } = data;

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #00FF00; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #00FF00; color: black; }
        .summary { margin: 20px 0; }
        .summary p { margin: 5px 0; }
      </style>
    </head>
    <body>
      <h1>Relatório de Estoque - MTec Energia</h1>
      <p>Gerado em: ${new Date(generatedAt).toLocaleDateString("pt-BR")}</p>
      
      <div class="summary">
        <h2>Resumo</h2>
        <p><strong>Entradas:</strong> ${totals.entrada}</p>
        <p><strong>Saídas:</strong> ${totals.saida}</p>
        <p><strong>Saldo:</strong> ${totals.saldo}</p>
      </div>

      <h2>Movimentações</h2>
      <table>
        <tr>
          <th>Data</th>
          <th>Material</th>
          <th>Tipo</th>
          <th>Quantidade</th>
          <th>Motivo</th>
        </tr>
  `;

  movements.forEach((m: any) => {
    const material = materials.find((mat: any) => mat.id === m.materialId);
    html += `
      <tr>
        <td>${new Date(m.movementDate).toLocaleDateString("pt-BR")}</td>
        <td>${material?.name || "Desconhecido"}</td>
        <td>${m.type}</td>
        <td>${m.quantity}</td>
        <td>${m.reason || "-"}</td>
      </tr>
    `;
  });

  html += `
      </table>
    </body>
    </html>
  `;

  return html;
}
