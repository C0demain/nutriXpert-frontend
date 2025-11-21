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

export interface Goal {
  id: number;
  userId: string;
  description: string;
  goalType: GoalTypeOps;
  targetWeight: number;
  targetCalories: number;
  currentCalories?: number;
  targetProtein?: number;
  currentProtein?: number;
  targetCarbs?: number;
  currentCarbs?: number;
  targetFats?: number;
  currentFats?: number;
  foodRestrictions: string;
}

export interface GoalProgress {
  id: number;
  userId: string;
  description: string;
  goalType: GoalTypeOps;
  weightProgress: number;
  targetWeight: number;
  currentWeight: number;
  caloriesProgress: number;
  targetCalories: number;
  currentCalories: number;
  proteinProgress: number;
  targetProtein: number;
  currentProtein: number;
  carbsProgress: number;
  targetCarbs: number;
  currentCarbs: number;
  fatsProgress: number;
  targetFats: number;
  currentFats: number;
}
