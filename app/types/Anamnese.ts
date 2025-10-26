import type { GoalTypeOps } from "./Goal"

export interface Anamnese{
    id?: string
    goalType: GoalTypeOps
    goalTypeOther: string
    healthConditionType: HealthConditionType
    healthConditionOther: string
    allergyIntoleranceType: AllergyIntolerance
    allergyIntoleranceOther: string
    surgeryType: Surgery
    surgeryTypeOther: string
    physicalActivityType: PhysicalActivity
    physicalActivityOther: string
    physicalActivityFrequency: PhysicalActivityFrequency
    physicalActivityDuration: PhysicalActivityDuration
    sleepQuality: SleepQuality
    nightAwakeningFrequency: NightAwakeningFrequency
    evacuationFrequencyType: EvacuationFrequency
    stressLevel: StressLevel
    alcoholConsumption: AlcoholConsuption
    tabagism: boolean
    hydration: Hydration
    continuousMedication: boolean
}

export const HealthConditions = ["Diabetes tipo 1", "Diabetes tipo 2", "Hipertensão arterial", "Dislipidemia (colesterol, triglicerídeos)", "Doença renal", "Doença hepática", "Gastrite / refluxo", "Intestino preso / diarreia", "Osteoporose", "Doença cardiovascular (infarto, insuficiência cardíaca)", "Câncer", "Depressão / Ansiedade", "Doenças autoimunes", "Outro"] as const
export type HealthConditionType = typeof HealthConditions[number]

export const AllergyIntoleranceTypes = ["Não", "Intolerância à lactose", "Sensibilidade ao glúten / doença celíaca", "Alergia alimentar", "Alergia medicamentosa", "Outro"] as const
export type AllergyIntolerance = typeof AllergyIntoleranceTypes[number]

export const SurgeryTypes = ["não", "Bariátrica", "Vesícula", "Hérnia de hiato (cirurgia do refluxo)", "Ortopédica", "Cesárea / Ginecológica", "Outro"] as const
export type Surgery = typeof SurgeryTypes[number]

export const PhysicalActivityType = ["Sedentário(a)", "Caminhada", "Musculação", "Corrida", "Crossfit", "Natação", "Outro"] as const
export type PhysicalActivity = typeof PhysicalActivityType[number]

export const PhysicalActivityFrequencies = ["1–2x por semana", "3–4x por semana", "5 ou mais vezes por semana"] as const
export type PhysicalActivityFrequency = typeof PhysicalActivityFrequencies[number]

export const PhysicalActivityDurations = ["30 min", "60 min", "90 min"] as const
export type PhysicalActivityDuration = typeof PhysicalActivityDurations[number]

export const SleepQualities = ["boa", "regular", "ruim"] as const
export type SleepQuality = typeof SleepQualities[number]

export const NightAwakeningFrequencies = ["nao", "pelo menos uma vez", "mais de uma vez"] as const
export type NightAwakeningFrequency = typeof NightAwakeningFrequencies[number]

export const EvacuationFrequencies = ["Todo dia", "5x por semana", "3x por semana", "1x por semana"] as const
export type EvacuationFrequency = typeof EvacuationFrequencies[number]

export const StressLevels = ["baixo", "moderado", "alto"] as const
export type StressLevel = typeof StressLevels[number]

export const AlcoholConsuptions = ["não consome", "Socialmente 1-2 x por semana", "Frequente 3-4 x por semana", "Uso diário"] as const
export type AlcoholConsuption = typeof AlcoholConsuptions[number]

export const Hydrations = ["Menos de 1L", "Entre 1L e 2L", "Mais de 2L"] as const
export type Hydration = typeof Hydrations[number]


