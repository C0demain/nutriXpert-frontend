export type GoalTypeOps =
  | 'WEIGHT_LOSS'
  | 'MUSCLE_GAIN'
  | 'DIABETES_CONTROL'
  | 'NUTRITIONAL_REEDUCATION'
  | 'PHYSICAL_MENTAL_PERFORMANCE'
  | 'WEIGHT_GAIN'
  | 'FAT_LOSS'
  | 'MAINTENANCE'

export interface Goal {
  id: number
  userId: string
  description: string
  goalType: GoalTypeOps
  targetWeight: number
  targetCalories: number
  foodRestrictions: string
}