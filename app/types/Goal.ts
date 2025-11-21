export type GoalTypeOps =
  | "Emagrecimento"
  | "Ganho de massa muscular"
  | "Controle de diabetes"
  | "Reeducação alimentar"
  | "Performance física e mental"
  | "Ganho de peso"
  | "Perda de gordura"
  | "Manutenção do peso";

export const goalTypeOpts = [
  { label: "Emagrecimento", value: "Emagrecimento" },
  { label: "Ganho de massa muscular", value: "Ganho de massa muscular" },
  { label: "Controle de diabetes", value: "Controle de diabetes" },
  { label: "Reeducação alimentar", value: "Reeducação alimentar" },
  {
    label: "Performance física e mental",
    value: "Performance física e mental",
  },
  { label: "Ganho de peso", value: "Ganho de peso" },
  { label: "Perda de gordura", value: "Perda de gordura" },
  { label: "Manutenção do peso", value: "Manutenção do peso" },
];

export const metricTypes = [
  { label: "Peso", name: "weight", unit: "Kg", key: "targetWeight" },
  { label: "Calorias", name: "calories", unit: "Kcal", key: "targetCalories" },
  { label: "Proteínas", name: "protein", unit: "g", key: "targetProtein" },
  { label: "Carboidratos", name: "carbs", unit: "g", key: "targetCarbs" },
  { label: "Gorduras", name: "fats", unit: "g", key: "targetFats" },
];


export interface Goal {
  id: number;
  userId: string;
  description: string;
  goalType: GoalTypeOps;
  targetWeight: number;
  targetCalories: number;
  foodRestrictions: string;
}
