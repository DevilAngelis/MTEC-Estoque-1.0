import { Movement, Material } from "../../drizzle/schema";

export function generateReportData(
  movements: Movement[],
  materials: Material[],
  options?: {
    startDate?: Date;
    endDate?: Date;
    materialId?: number;
    type?: "entrada" | "saida" | "consolidado";
  }
) {
  let filtered = movements;

  if (options?.startDate) {
    filtered = filtered.filter(m => new Date(m.movementDate) >= options.startDate!);
  }
  if (options?.endDate) {
    const end = new Date(options.endDate);
    end.setHours(23, 59, 59, 999);
    filtered = filtered.filter(m => new Date(m.movementDate) <= end);
  }
  if (options?.materialId) {
    filtered = filtered.filter(m => m.materialId === options.materialId);
  }
  if (options?.type && options.type !== "consolidado") {
    filtered = filtered.filter(m => m.type === options.type);
  }

  let entrada = 0;
  let saida = 0;

  filtered.forEach(m => {
    if (m.type === "entrada") entrada += m.quantity;
    else saida += m.quantity;
  });

  return {
    movements: filtered,
    materials,
    totals: {
      entrada,
      saida,
      saldo: entrada - saida,
    },
    generatedAt: new Date(),
  };
}

export function generateCSV(data: ReturnType<typeof generateReportData>) {
  let csv = "Data,Material,Tipo,Quantidade,Motivo,Observações\n";

  data.movements.forEach(m => {
    const material = data.materials.find(mat => mat.id === m.materialId);
    csv += `${new Date(m.movementDate).toLocaleDateString("pt-BR")},${material?.name || "Desconhecido"},${m.type},${m.quantity},"${m.reason || ""}","${m.notes || ""}"\n`;
  });

  return csv;
}
