export type GoalTypeOps =
  | 'WEIGHT_LOSS'
  | 'MUSCLE_GAIN'
  | 'DIABETES_CONTROL'
  | 'NUTRITIONAL_REEDUCATION'
  | 'PHYSICAL_MENTAL_PERFORMANCE'
  | 'WEIGHT_GAIN'
  | 'FAT_LOSS'
  | 'MAINTENANCE'

export const goalTypeOpts = [
  { label: 'Emagrecimento', value: 'WEIGHT_LOSS' },
  { label: 'Ganho de massa muscular', value: 'MUSCLE_GAIN' },
  { label: 'Controle de diabetes', value: 'DIABETES_CONTROL' },
  { label: 'Reeducação alimentar', value: 'NUTRITIONAL_REEDUCATION' },
  { label: 'Performance física e mental', value: 'PHYSICAL_MENTAL_PERFORMANCE' },
  { label: 'Ganho de peso', value: 'WEIGHT_GAIN' },
  { label: 'Perda de gordura', value: 'FAT_LOSS' },
  { label: 'Manutenção do peso', value: 'MAINTENANCE' }
]

export interface Goal {
  id: number
  userId: string
  description: string
  goalType: GoalTypeOps
  targetWeight: number
  targetCalories: number
  foodRestrictions: string
}