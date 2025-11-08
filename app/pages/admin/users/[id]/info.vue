<template>
    <div v-if="error" class="mt-">
        <h1 class="text-5xl">Não foi possível carregar as informações deste usuário</h1>
        <Button variant="outlined" class="my-4 w-full" @click="() => refresh()">Tentar novamente</Button>
    </div>
    <div class="space-y-4" v-if="pending">
        <Skeleton shape="rectangle" height='100px'/>
        <Skeleton shape="rectangle" height='100px'/>
        <div class="flex gap-4">
            <Skeleton shape="rectangle" height='300px'/>
            <Skeleton shape="rectangle" height='300px'/>
        </div>
        <Skeleton shape="rectangle" height='350px'/>
    </div>
    <div v-if="!error && !pending">
        <h1 class="page-title">{{ user?.name }}</h1>
        <Button variant="outlined" class="my-4 w-full" @click="() => refresh()">Recarregar informações</Button>
        <div class="flex w-full gap-4 mb-4">
            <Panel header="Peso" class="w-full">
                <div class="flex items-end gap-2" v-if="user?.weight">
                    <p class="text-6xl">{{ user?.weight }}</p>
                    <span class="text-3xl">Kg</span>
                </div>
                <p class="text-xl" v-if="!user?.weight">Nenhum peso registrado ainda</p>
            </Panel>
            <Panel header="Altura" class="w-full">
                <div class="flex items-end gap-2" v-if="user?.height">
                    <p class="text-6xl">{{ user?.height }}</p>
                    <span class="text-3xl">cm</span>
                </div>
                <p class="text-xl" v-if="!user?.height">Nenhuma altura registrado ainda</p>
            </Panel>
            <Panel header="Objetivo" class="w-full" v-if="user?.anamnese">
                <p class="text-3xl">{{ user?.anamnese.goalType }}</p>
                <p class="text-xl" v-if="!user?.anamnese.goalType">Nenhum objetivo registrado ainda</p>
            </Panel>
        </div>
        <div class="flex w-full gap-4 mb-4" v-if="user?.anamnese">
            <Panel class="w-full">
                <template #header>
                    <p class="font-medium text-3xl">Condições e alergias</p>
                </template>
                <div class="space-y-3">
                    <div>
                        <p class="font-medium">Condição</p>
                        <p v-if="user?.anamnese.healthConditionType !== 'Outro'">{{ user?.anamnese.healthConditionType }}</p>
                        <p v-if="user?.anamnese.healthConditionType === 'Outro'">{{ user?.anamnese.healthConditionOther }}</p>
                    </div>
        
                    <div>
                        <p class="font-medium">Alergia</p>
                        <p v-if="user?.anamnese.allergyIntoleranceType !== 'Outro'">{{ user?.anamnese.allergyIntoleranceType }}</p>
                        <p v-if="user?.anamnese.allergyIntoleranceType === 'Outro'">{{ user?.anamnese.allergyIntoleranceOther }}</p>
                    </div>
                    <div>
                        <p class="font-medium">Cirurgia</p>
                        <p v-if="user?.anamnese.surgeryType !== 'Outro'">{{ user?.anamnese.surgeryType }}</p>
                        <p v-if="user?.anamnese.surgeryType === 'Outro'">{{ user?.anamnese.surgeryTypeOther }}</p>
                    </div>
                    <div>
                        <p class="font-medium">Toma remédio controlado?</p>
                        <p>{{ user?.anamnese.continuousMedication ? 'Sim' : 'Não' }}</p>
                    </div>
                </div>
            </Panel>
        
            <Panel class="w-full">
                <template #header>
                    <p class="font-medium text-3xl">Atividade física</p>
                </template>
                <div class="space-y-3">
                    <div>
                        <p class="font-medium">Atividade física</p>
                        <p v-if="user?.anamnese.physicalActivityType !== 'Outro'">{{ user?.anamnese.physicalActivityType }}</p>
                        <p v-if="user?.anamnese.physicalActivityType === 'Outro'">{{ user?.anamnese.physicalActivityOther }}</p>
                    </div>
        
                    <div v-if="user?.anamnese.physicalActivityType !== 'Sedentário(a)'">
                        <p class="font-medium">Frequência</p>
                        <p>{{ user?.anamnese.physicalActivityFrequency }}</p>
                    </div>
        
                    <div v-if="user?.anamnese.physicalActivityType !== 'Sedentário(a)'">
                        <p class="font-medium">Duração</p>
                        <p>{{ user?.anamnese.physicalActivityDuration }}</p>
                    </div>
                </div>
        
            </Panel>
        </div>

        <Panel class="w-full" :pt="{ content: {class: 'flex gap-8' } }" v-if="user?.anamnese">
            <template #header>
                <p class="font-medium text-3xl">Rotina</p>
            </template>
        
            <div class="space-y-3 w-full">
                <div>
                    <p class="font-medium">Qualidade do sono</p>
                    <p>{{ user?.anamnese.sleepQuality }}</p>
                </div>
        
                <div>
                    <p class="font-medium">Frequência de vezes que acorda à noite</p>
                    <p>{{ user?.anamnese.nightAwakeningFrequency }}</p>
                </div>
        
                <div>
                    <p class="font-medium">Frequência de evacuação</p>
                    <p>{{ user?.anamnese.evacuationFrequencyType }}</p>
                </div>
        
                <div>
                    <p class="font-medium">Nível de estresse</p>
                    <p>{{ user?.anamnese.stressLevel }}</p>
                </div>
            </div>
            <div class="space-y-3 w-full">
                <div>
                    <p class="font-medium">Consumo de álcool</p>
                    <p>{{ user?.anamnese.alcoholConsumption }}</p>
                </div>
                <div>
                    <p class="font-medium">Fuma?</p>
                    <p>{{ user?.anamnese.tabagism ? 'Sim' : 'Não' }}</p>
                </div>
                <div>
                    <p class="font-medium">Consumo diário de água</p>
                    <p>{{ user?.anamnese.hydration }}</p>
                </div>
            </div>
        </Panel>
        <div v-if="!user?.anamnese" class="p-4 border rounded-lg border-gray-200">
            <p class="text-center text-3xl text-gray-600">Anamnese ainda não realizada</p>
        </div>
    </div>

</template>

<script setup lang="ts">
    import {z} from 'zod'
    import type { User } from '~/types/User'

    definePageMeta({
        validate(route){
            const {success} = z.uuid().safeParse(route.params.id)
            return success
        }
    })

    const route = useRoute()

    const {data: user, refresh, error, pending} = await useAPI<User>(`/user/${route.params.id}`, {
        key: `${route.params.id}:anamnese`
    })
    console.log(user.value)

</script>