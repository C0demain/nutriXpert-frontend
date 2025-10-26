<script setup lang="ts">
import { SelectButton } from 'primevue'
import { AlcoholConsuptions, AllergyIntoleranceTypes, EvacuationFrequencies, GoalTypes, HealthConditions, Hydrations, NightAwakeningFrequencies, PhysicalActivityDurations, PhysicalActivityFrequencies, PhysicalActivityType, SleepQualities, StressLevels, SurgeryTypes, type AlcoholConsuption, type AllergyIntolerance, type Anamnese, type EvacuationFrequency, type GoalType, type HealthConditionType, type Hydration, type NightAwakeningFrequency, type PhysicalActivity, type PhysicalActivityDuration, type PhysicalActivityFrequency, type SleepQuality, type StressLevel, type Surgery } from '~/types/Anamnese'


const toast = useToast()
const authStore = useAuthStore()

const activeStep = ref<string>("1")

// Campos da anamnese
const goalType = ref<GoalType>()
const goalTypeOther = ref<string>("")
const healthConditionType = ref<HealthConditionType>()
const healthConditionOther = ref<string>("")
const allergyIntoleranceType = ref<AllergyIntolerance>()
const allergyIntoleranceOther = ref<string>("")
const surgeryType = ref<Surgery>()
const surgeryTypeOther = ref<string>("")
const physicalActivityType = ref<PhysicalActivity>()
const physicalActivityOther = ref<string>("")
const physicalActivityFrequency = ref<PhysicalActivityFrequency>()
const physicalActivityDuration = ref<PhysicalActivityDuration>()
const sleepQuality = ref<SleepQuality>("regular")
const nightAwakeningFrequency = ref<NightAwakeningFrequency>("nao")
const evacuationFrequencyType = ref<EvacuationFrequency>()
const stressLevel = ref<StressLevel>()
const alcoholConsumption = ref<AlcoholConsuption>()
const tabagism = ref<boolean>(false)
const hydration = ref<Hydration>()
const continuousMedication = ref<boolean>(false)

// Preenche caso já exista uma anamnese associada
const {data: oldAnamnese} = await useAPI<Anamnese>(`/user/${authStore.userId}/anamnese`)
if(oldAnamnese.value){
    goalType.value = oldAnamnese.value.goalType
    goalTypeOther.value = oldAnamnese.value.goalTypeOther
    healthConditionType.value = oldAnamnese.value.healthConditionType
    healthConditionOther.value = oldAnamnese.value.healthConditionOther
    allergyIntoleranceType.value = oldAnamnese.value.allergyIntoleranceType
    allergyIntoleranceOther.value = oldAnamnese.value.allergyIntoleranceOther
    surgeryType.value = oldAnamnese.value.surgeryType
    surgeryTypeOther.value = oldAnamnese.value.surgeryTypeOther
    physicalActivityType.value = oldAnamnese.value.physicalActivityType
    physicalActivityOther.value = oldAnamnese.value.physicalActivityOther
    physicalActivityFrequency.value = oldAnamnese.value.physicalActivityFrequency
    physicalActivityDuration.value = oldAnamnese.value.physicalActivityDuration
    sleepQuality.value = oldAnamnese.value.sleepQuality
    nightAwakeningFrequency.value = oldAnamnese.value.nightAwakeningFrequency
    evacuationFrequencyType.value = oldAnamnese.value.evacuationFrequencyType
    stressLevel.value = oldAnamnese.value.stressLevel
    alcoholConsumption.value = oldAnamnese.value.alcoholConsumption
    tabagism.value = oldAnamnese.value.tabagism
    hydration.value = oldAnamnese.value.hydration
    continuousMedication.value = oldAnamnese.value.continuousMedication
}

async function handleSubmit(){
    const {error} = await useAPI(`/user/${authStore.userId}/anamnese`, {
        method: oldAnamnese.value ? 'put' : 'post',
        body: {
            goalType,
            goalTypeOther,
            healthConditionType,
            healthConditionOther,
            allergyIntoleranceType,
            allergyIntoleranceOther,
            surgeryType,
            surgeryTypeOther,
            physicalActivityType,
            physicalActivityOther,
            physicalActivityFrequency,
            physicalActivityDuration,
            sleepQuality,
            nightAwakeningFrequency,
            evacuationFrequencyType,
            stressLevel,
            alcoholConsumption,
            tabagism,
            hydration,
            continuousMedication
        }
    })

    if(error.value){
        switch (error.value.statusCode){
            case 500:
                toast.add({severity: 'error', summary: 'Erro ao enviar', detail: 'Algo deu errado. Tente novamente', life: 3000})
            case 400:
                toast.add({severity: 'error', summary: 'Erro ao enviar', detail: 'Algo deu errado. Tente novamente', life: 3000})
        }
    }else{
        toast.add({severity: 'success', summary: 'Sucesso', detail: 'Anamnese enviada com sucesso', life: 3000})
    }
    
}

</script>

<template>
    <h1 class="page-title">Anamnese</h1>
    <form @submit.prevent="handleSubmit">
        <Stepper value="1" linear>
            <StepList>
                <Step value="1">Condições</Step>
                <Step value="2">Atividade física</Step>
                <Step value="3">Rotina diária</Step>
            </StepList>
            <StepPanels>
                <StepPanel v-slot="{ activateCallback }" value="1" class="flex flex-col gap-6">
                    <div class="flex flex-col gap-2">
                        <label for="goalType">Qual seu principal objetivo?</label>
                        <Select :options="GoalTypes.map(k => k)" id="goalType" v-model="goalType"/>
                    </div>
                    <div class="flex flex-col gap-2" v-if="false">
                        <label for="goalTypeOther">Especifique</label>
                        <InputText id="goalTypeOther" v-model="goalTypeOther"/>
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="healthCondition">Você possui ou já teve alguma condição?</label>
                        <Select :options="HealthConditions.map(v => v)" id="healthCondition" v-model="healthConditionType"/>
                    </div>
                    <div class="flex flex-col gap-2" v-if="healthConditionType === 'Outro'">
                        <label for="healthConditionOther">Especifique sua condição</label>
                        <InputText id="healthConditionOther" v-model="healthConditionOther"/>
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="allergyIntoleranceType">Possui alguma alergia ou intolerância?</label>
                        <Select :options="AllergyIntoleranceTypes.map(v => v)" id="allergyIntoleranceType" v-model="allergyIntoleranceType"/>
                    </div>
                    <div class="flex flex-col gap-2" v-if="allergyIntoleranceType === 'Outro'">
                        <label for="allergyIntoleranceOther">Especifique sua alergia</label>
                        <InputText id="allergyIntoleranceOther" v-model="allergyIntoleranceOther"/>
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="surgeryType">Você já realizou alguma cirurgia?</label>
                        <Select :options="SurgeryTypes.map(v => v)" id="surgeryType" v-model="surgeryType"/>
                    </div>
                    <div class="flex flex-col gap-2" v-if="surgeryType === 'Outro'">
                        <label for="surgeryTypeOther">Especifique sua cirurgia</label>
                        <InputText id="surgeryTypeOther" v-model="surgeryTypeOther"/>
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="continuosMedication">Toma remédio controlado?</label>
                        <div class="flex gap-2">
                            <label>Não</label>
                            <ToggleSwitch id="continuosMedication" v-model="continuousMedication"/>
                            <label>Sim</label>
                        </div>
                    </div>

                    <Button class="w-fit self-end" label="Próximo" icon="pi pi-arrow-right" iconPos="right" @click="activateCallback('2')"/>
                </StepPanel>
            </StepPanels>
            <StepPanel v-slot="{ activateCallback }" value="2" class="flex flex-col gap-6">
                <div class="flex flex-col gap-2">
                    <label for="physicalActivityType">Qual atividade mais te descreve?</label>
                    <Select :options="PhysicalActivityType.map(v => v)" id="physicalActivityType" v-model="physicalActivityType"/>
                </div>
                <div class="flex flex-col gap-2" v-if="physicalActivityType === 'Outro'">
                    <label for="physicalActivityOther">Especifique sua atividade</label>
                    <InputText id="physicalActivityOther" v-model="physicalActivityOther"/>
                </div>
                <div class="flex flex-col gap-2" v-if="physicalActivityType !== 'Sedentário(a)' && physicalActivityType">
                    <label>Com que frequência você pratica essa atividade?</label>
                    <div class="space-x-2" v-for="frequency in PhysicalActivityFrequencies">
                        <RadioButton v-model="physicalActivityFrequency" :value="frequency" :id="frequency"/>
                        <label :for="frequency">{{ frequency }}</label>
                    </div>
                </div>
                <div class="flex flex-col gap-2" v-if="physicalActivityType !== 'Sedentário(a)' && physicalActivityType">
                    <label>Qual a duração por dia dessa atividade?</label>
                    <div class="space-x-2" v-for="duration in PhysicalActivityDurations">
                        <RadioButton v-model="physicalActivityDuration" :value="duration" :id="duration"/>
                        <label :for="duration">{{ duration }}</label>
                    </div>
                </div>
                <div class="flex justify-between">
                    <Button label="Anterior" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback('1')" />
                    <Button label="Próximo" icon="pi pi-arrow-right" iconPos="right" @click="activateCallback('3')" />
                </div>
            </StepPanel>
            <StepPanel v-slot="{ activateCallback }" value="3" class="flex flex-col gap-6">
                <div class="flex flex-col gap-2">
                    <label for="sleepQuality">Como você descreveria sua qualidade de sono?</label>
                    <SelectButton :options="SleepQualities.map(v => v)" id="sleepQuality" v-model="sleepQuality"/>
                </div>
                
                <div class="flex flex-col gap-2">
                    <label for="nightAwakeningFrequency">Você costuma acordar durante a noite?</label>
                    <SelectButton :options="NightAwakeningFrequencies.map(v => v)" id="nightAwakeningFrequency" v-model="nightAwakeningFrequency"/>
                    </div>
                    
                <div class="flex flex-col gap-2">
                    <label>Quantas vezes por semana você evacua?</label>
                    <div class="space-x-2" v-for="frequencyEvac in EvacuationFrequencies">
                        <RadioButton v-model="evacuationFrequencyType" :value="frequencyEvac" :id="frequencyEvac"/>
                        <label :for="frequencyEvac">{{ frequencyEvac }}</label>
                    </div>
                </div>
                
                <div class="flex flex-col gap-2">
                    <label for="stressLevel">Como você descreveria seu nível de estresse diariamente?</label>
                    <SelectButton :options="StressLevels.map(v => v)" id="stressLevel" v-model="stressLevel"/>
                </div>
                
                <div class="flex flex-col gap-2">
                    <label>Você costuma beber?</label>
                    <div class="space-x-2" v-for="consumo in AlcoholConsuptions">
                        <RadioButton v-model="alcoholConsumption" :value="consumo" :id="consumo"/>
                        <label :for="consumo">{{ consumo }}</label>
                    </div>
                </div>

                <div class="flex flex-col gap-2">
                    <label for="tabagism">Você fuma?</label>
                    <div class="flex gap-2">
                        <label>Não</label>
                        <ToggleSwitch id="tabagism" v-model="tabagism"/>
                        <label>Sim</label>
                    </div>
                </div>

                <div class="flex flex-col gap-2">
                    <label>Quantos litros de água você bebe por dia?</label>
                    <div class="space-x-2" v-for="hydrationFreq in Hydrations">
                        <RadioButton v-model="hydration" :value="hydrationFreq" :id="hydrationFreq"/>
                        <label :for="hydrationFreq">{{ hydrationFreq }}</label>
                    </div>
                </div>

                <div class="flex justify-between mb-10">
                    <Button label="Anterior" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback('2')" />
                    <Button class="flex pt-6" type="submit">{{!!oldAnamnese ? "Atualizar" : "Enviar"}}</Button>
                </div>
            </StepPanel>
        </Stepper>

    </form>
</template>