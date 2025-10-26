import type { MealType } from "~/types/Meal"

export function formatDate(date: Date, includeTime?: boolean){
    return date.toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'})
}

export function formatDateString(dateString: string){
    const date = new Date(dateString)
    return formatDate(date)
}

export function translateMealType(mealType: MealType | string){
    switch(mealType){
        case 'BREAKFAST':
            return 'Café da manhã'
        case 'SNACK':
            return 'Lanche'
        case 'LUNCH':
            return 'Almoço'
        case 'AFTERNOON_SNACK':
            return 'Lanche da tarde'
        case 'DINNER':
            return 'Jantar'
        case 'SUPPER':
            return 'Ceia'
    }
}