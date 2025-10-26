import type { Food } from "~/types/Food"

export interface CreateMeal{
    description: string
    mealDateTime: Date
    type: MealType
}

export interface Meal{
    id: number
    description: string
    mealDateTime: string
    type: MealType
    foods: Food[]
    userId: string
    createdAt: Date
}

export type MealType = "BREAKFAST" | "SNACK" | "LUNCH" | "AFTERNOON_SNACK" | "DINNER" | "SUPPER"