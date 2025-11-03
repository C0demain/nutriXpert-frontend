<script setup lang="ts">
import { SelectButton } from 'primevue'
import { AlcoholConsuptions, AllergyIntoleranceTypes, EvacuationFrequencies, HealthConditions, Hydrations, NightAwakeningFrequencies, PhysicalActivityDurations, PhysicalActivityFrequencies, PhysicalActivityType, SleepQualities, StressLevels, SurgeryTypes, type AlcoholConsuption, type AllergyIntolerance, type Anamnese, type EvacuationFrequency, type HealthConditionType, type Hydration, type NightAwakeningFrequency, type PhysicalActivity, type PhysicalActivityDuration, type PhysicalActivityFrequency, type SleepQuality, type StressLevel, type Surgery } from '~/types/Anamnese'
import { goalTypeOpts, type GoalTypeOps } from '~/types/Goal'

const toast = useToast()
const authStore = useAuthStore()

const activeStep = ref<string>("1")

// Campos da anamnese
const goalType = ref<GoalTypeOps>()
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
                    <FormSelectField
                    id="goalType"
                    label="Qual seu principal objetivo?"
                    placeholder="Selecione um objetivo"
                    :options="goalTypeOpts"
                    option-label="label"
                    option-value="value"
                    v-model="goalType"
                    />
                    
                    <FormTextField
                    id="goalTypeOther"
                    label="Especifique"
                    v-model="goalTypeOther"
                    v-if="false"
                    />
                    
                    <FormSelectField
                    id="healthCondition"
                    label="Você possui ou já teve alguma condição?"
                    :options="HealthConditions.map(v => v)"
                    v-model="healthConditionType"
                    />

                    <FormTextField
                    id="healthConditionOther"
                    label="Especifique sua condição"
                    v-model="healthConditionOther"
                    v-if="healthConditionType === 'Outro'"
                    />
                    
                    <FormSelectField
                    id="allergyIntoleranceType"
                    label="Possui alguma alergia ou intolerância?"
                    :options="AllergyIntoleranceTypes.map(v => v)"
                    v-model="allergyIntoleranceType"
                    />

                    <FormTextField
                    id="allergyIntoleranceOther"
                    label="Especifique sua alergia"
                    v-model="allergyIntoleranceOther"
                    v-if="allergyIntoleranceType === 'Outro'"
                    />

                    <FormSelectField
                    id="surgeryType"
                    label="Você já realizou alguma cirurgia?"
                    :options="SurgeryTypes.map(v => v)"
                    v-model="surgeryType"
                    />

                    <FormTextField
                    id="surgeryTypeOther"
                    label="Especifique sua cirurgia"
                    v-model="surgeryTypeOther"
                    v-if="surgeryType === 'Outro'"
                    />

                    <FormSwitchField
                    id="continuosMedication"
                    label="Toma remédio controlado?"
                    active-label="Sim"
                    inactive-label="Não"
                    v-model="continuousMedication"
                    />

                    <Button class="w-fit self-end" label="Próximo" icon="pi pi-arrow-right" iconPos="right" @click="activateCallback('2')"/>
                </StepPanel>
                <StepPanel v-slot="{ activateCallback }" value="2" class="flex flex-col gap-6">
                    <FormSelectField
                    id="physicalActivityType"
                label="Qual atividade mais te descreve?"
                :options="PhysicalActivityType.map(v => v)"
                v-model="physicalActivityType"
                />
                
                <FormTextField
                id="physicalActivityOther"
                label="Especifique sua atividade"
                v-model="physicalActivityOther"
                v-if="physicalActivityType === 'Outro'"
                />
                
                <FormRadioField
                label="Com que frequência você pratica essa atividade?"
                :options="PhysicalActivityFrequencies.map(v => v)"
                v-model="physicalActivityFrequency"
                v-if="physicalActivityType !== 'Sedentário(a)' && physicalActivityType"
                />

                <FormRadioField
                label="Qual a duração por dia dessa atividade?"
                :options="PhysicalActivityDurations.map(v => v)"
                v-model="physicalActivityDuration"
                v-if="physicalActivityType !== 'Sedentário(a)' && physicalActivityType"
                />

                <div class="flex justify-between">
                    <Button label="Anterior" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback('1')" />
                    <Button label="Próximo" icon="pi pi-arrow-right" iconPos="right" @click="activateCallback('3')" />
                </div>
            </StepPanel>
            <StepPanel v-slot="{ activateCallback }" value="3" class="flex flex-col gap-6">
                <FormFlatSelectField
                id="sleepQuality"
                label="Como você descreveria sua qualidade de sono?"
                :options="SleepQualities.map(v => v)"
                v-model="sleepQuality"
                />
                
                <FormFlatSelectField
                id="nightAwakeningFrequency"
                label="Você costuma acordar durante a noite?"
                :options="NightAwakeningFrequencies.map(v => v)"
                v-model="nightAwakeningFrequency"
                />
                
                <FormRadioField
                label="Quantas vezes por semana você evacua?"
                :options="EvacuationFrequencies.map(v => v)"
                v-model="evacuationFrequencyType"
                />
                
                <FormFlatSelectField
                id="stressLevel"
                label="Como você descreveria seu nível de estresse diariamente?"
                :options="StressLevels.map(v => v)"
                v-model="stressLevel"
                />
                
                <FormRadioField
                label="Você costuma beber?"
                :options="AlcoholConsuptions.map(v => v)"
                v-model="alcoholConsumption"
                />
                
                <FormSwitchField
                id="tabagism"
                label="Você fuma?"
                active-label="Sim"
                inactive-label="Não"
                v-model="tabagism"
                />
                
                <FormRadioField
                label="Quantos litros de água você bebe por dia?"
                :options="Hydrations.map(v => v)"
                v-model="hydration"
                />
                
                <div class="flex justify-between mb-10">
                    <Button label="Anterior" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback('2')" />
                    <Button class="flex pt-6" type="submit">{{!!oldAnamnese ? "Atualizar" : "Enviar"}}</Button>
                </div>
            </StepPanel>
        </StepPanels>
        </Stepper>

    </form>
</template>