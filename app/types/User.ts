import type { Anamnese } from "./Anamnese";
import type { Role } from "./Role";

export interface User{
    id: string
    name: string
    email: string
    role: Role
    weight: number
    height: number
    anamnese: Anamnese
}