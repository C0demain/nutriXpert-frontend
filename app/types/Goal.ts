export interface Goal{
    id: number,
    userId: string,
    description: string,
    goalType: "Perda de peso" | "Ganho de peso" | "Ganho de massa" | "Perda de gordura" | "Manutenção do peso",
    targetWeight: number,
    targetCalories: number,
    foodRestrictions: string
}