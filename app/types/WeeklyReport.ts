export interface NutrientSummary {
  totalCalories: number
  averageCalories: number
  totalProtein: number
  averageProtein: number
  totalCarbs: number
  averageCarbs: number
  totalFat: number
  averageFat: number
  totalMeals: number
  averageMealsPerDay: number
}

export interface DailySummary {
  date: string | {year: number, month: number, day: number}
  totalMeals: number
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  goalsMet: boolean
  mealTypes: string[]
}

export interface WeeklyReport {
  weekStart: string | {year: number, month: number, day: number}
  weekEnd: string | {year: number, month: number, day: number}
  userId: string
  nutrientSummary: NutrientSummary
  dailySummaries: DailySummary[]
}
