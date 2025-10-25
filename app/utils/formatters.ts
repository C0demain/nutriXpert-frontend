export function formatDate(date: Date, includeTime?: boolean){
    return date.toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'})
}

export function formatDateString(dateString: string){
    const date = new Date(dateString)
    return formatDate(date)
}