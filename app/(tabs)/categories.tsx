import React, { useState, useCallback } from "react";
import {
  View,
  Text,
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

export default function CategoriesScreen() {
  const colors = useColors();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const categoriesQuery = trpc.categories.list.useQuery();
  const createMutation = trpc.categories.create.useMutation();
  const deleteMutation = trpc.categories.delete.useMutation();

  useFocusEffect(
    useCallback(() => {
      categoriesQuery.refetch();
    }, [])
  );

  const handleAddCategory = async () => {
    if (!formData.name.trim()) {
      Alert.alert("Erro", "Nome da categoria é obrigatório");
      return;
    }
    try {
      await createMutation.mutateAsync({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
      });
      setShowAddModal(false);
      setFormData({ name: "", description: "" });
      categoriesQuery.refetch();
      Alert.alert("Sucesso", "Categoria criada!");
    } catch (e: any) {
      Alert.alert("Erro", e.message || "Falha ao criar categoria");
    }
  };

  const handleDelete = (id: number, name: string) => {
    Alert.alert("Confirmar", `Deletar categoria "${name}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Deletar",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteMutation.mutateAsync({ id });
            categoriesQuery.refetch();
            Alert.alert("Sucesso", "Categoria deletada!");
          } catch (e: any) {
            Alert.alert("Erro", e.message || "Falha ao deletar");
          }
        },
      },
    ]);
  };

  return (
    <ScreenContainer className="p-0">
      <View className="flex-1 bg-[#0a0a0a]">
        <View className="flex-row items-center justify-between px-4 py-6 pt-12 border-b border-[#333]">
          <View className="flex-row items-center">
            <View className="w-1 h-6 bg-[#00FF00] mr-2" />
            <Text className="text-xl font-bold text-white uppercase">Categorias</Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowAddModal(true)}
            className="bg-[#00FF00] rounded-lg px-4 py-2"
          >
            <Text className="text-black font-semibold">+ Nova</Text>
          </TouchableOpacity>
        </View>

        {categoriesQuery.isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#00FF00" />
          </View>
        ) : (
          <View className="flex-1">
            <View className="flex-row bg-[#1a1a1a] px-4 py-3 border-b border-[#333]">
              <Text className="flex-1 text-xs text-gray-400 uppercase font-semibold">Nome</Text>
              <Text className="flex-1 text-xs text-gray-400 uppercase font-semibold">Descrição</Text>
              <Text className="flex-1 text-xs text-gray-400 uppercase font-semibold">Criado em</Text>
              <Text className="w-16 text-xs text-gray-400 uppercase font-semibold">Ações</Text>
            </View>
            {categoriesQuery.data?.length ? (
              <FlatList
                data={categoriesQuery.data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View className="flex-row items-center px-4 py-3 border-b border-[#333]">
                    <Text className="flex-1 text-white">{item.name}</Text>
                    <Text className="flex-1 text-gray-400 text-sm">
                      {item.description || "-"}
                    </Text>
                    <Text className="flex-1 text-gray-400 text-sm">
                      {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleDelete(item.id, item.name)}
                      className="w-16"
                    >
                      <Text className="text-red-500 font-bold">✕</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            ) : (
              <View className="flex-1 justify-center items-center py-12">
                <Text className="text-gray-500">Nenhuma categoria cadastrada</Text>
              </View>
            )}
          </View>
        )}

        <Modal visible={showAddModal} animationType="slide" transparent>
          <View className="flex-1 bg-black/50 justify-end">
            <View className="bg-[#1a1a1a] rounded-t-2xl p-6 pb-12">
              <Text className="text-xl font-bold text-white uppercase mb-6">Nova Categoria</Text>
              <Text className="text-xs text-gray-400 mb-1">Nome da categoria *</Text>
              <TextInput
                placeholder="Nome da categoria"
                placeholderTextColor={colors.muted}
                value={formData.name}
                onChangeText={(t) => setFormData({ ...formData, name: t })}
                className="bg-black border border-[#00FF00] rounded-lg px-4 py-3 text-white mb-4"
              />
              <Text className="text-xs text-gray-400 mb-1">Descrição (opcional)</Text>
              <TextInput
                placeholder="Descrição (opcional)"
                placeholderTextColor={colors.muted}
                value={formData.description}
                onChangeText={(t) => setFormData({ ...formData, description: t })}
                className="bg-black border border-[#333] rounded-lg px-4 py-3 text-white mb-6"
              />
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={handleAddCategory}
                  disabled={createMutation.isPending}
                  className="flex-1 bg-[#00FF00] rounded-lg py-3 flex-row items-center justify-center gap-2"
                >
                  {createMutation.isPending ? (
                    <ActivityIndicator color="#000" />
                  ) : (
                    <>
                      <Text className="text-black font-bold">✓</Text>
                      <Text className="text-black font-semibold">Salvar</Text>
                    </>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setShowAddModal(false);
                    setFormData({ name: "", description: "" });
                  }}
                  className="flex-1 bg-[#333] rounded-lg py-3 flex-row items-center justify-center gap-2"
                >
                  <Text className="text-white font-bold">✕</Text>
                  <Text className="text-white font-semibold">Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScreenContainer>
  );
}
