<script setup lang="ts">

const weight = ref<number | null>(null)
const height = ref<number | null>(null)

const doesExercise = ref<string | null>("Não")
const exerciseFrequency = ref<string | null>(null)

const conditions = ref<string[]>([])
const otherConditions = ref<string | null>(null)

const restricions = ref<string[]>([])
const otherRestrictions = ref<string | null>(null)

const usesMedication = ref<string | null>("Não")
const medication = ref<string | null>(null)

</script>

<template>
    <h1 class="page-title mx-auto">Anamnese</h1>
    <form action="" class="p-8 border border-gray-200 rounded-lg flex flex-col gap-4 max-w-fit min-w-3/6 mx-auto items-stretch">
        <h2 class="form-title">Preencha as informações abaixo</h2>
        <div class="flex justify-between gap-8">
            <div class="w-full">
                <label for="peso">Peso</label>
                <InputGroup class="mt-2">
                    <InputNumber id="peso" placeholder="00" v-model="weight" required/>
                    <InputGroupAddon>Kg</InputGroupAddon>
                </InputGroup>
            </div>
            <div class="w-full">
                <label for="altura">Altura</label>
                <InputGroup class="mt-2">
                    <InputNumber id="altura" placeholder="Ex. 175" v-model="height" required/>
                    <InputGroupAddon>cm</InputGroupAddon>
                </InputGroup>
            </div>
        </div>
        <div class="flex gap-6">
            <div class="">
                <label for="atividadeFisica" class="whitespace-nowrap">Pratica atividade física?</label>
                <InputGroup class="mt-2">
                    <SelectButton id="atividadeFisica" :options="['Não', 'Sim']" v-model="doesExercise" required/>
                </InputGroup>
            </div>
            <div v-if="doesExercise === 'Sim'" class="w-full">
                <label for="frequenciaAtividade">Com que frequência você realiza atividade física?</label>
                <InputGroup class="mt-2">
                    <Select id="frequenciaAtividade" :options="['Diariamente', '1 ou 2 vezes na semana', '3 a 5 vezes na semana', 'De vez em quando']" v-model="exerciseFrequency"/>
                </InputGroup>
            </div>
        </div>
        <div class="flex justify-between gap-8">
            <div class="w-full">
                <label for="condicoes">Possui alguma condição ou doença?</label>
                <InputGroup class="mt-2">
                    <MultiSelect id="condicoes" :options="['Diabetes', 'Hipertensão', 'Colesterol alto', 'Câncer', 'Outros (Especificar)']" v-model="conditions" />
                </InputGroup>
            </div>
            <div v-if="conditions.includes('Outros (Especificar)')" class="w-full">
                <label for="outros">(Outros) Especifique</label>
                <InputGroup class="mt-2">
                    <InputText id="outros" type="text" v-model="otherConditions" />
                </InputGroup>
            </div>
        </div>
        <div class="flex justify-between gap-8">
            <div class="w-full">
                <label for="condicoes">Possui alguma restrição alimentar?</label>
                <InputGroup class="mt-2">
                    <MultiSelect id="condicoes" :options="['Intolerante à lactose', 'Celíaco', 'Vegetariano', 'Kosher', 'Halal', 'Alergia (Especificar)']" v-model="restricions" />
                </InputGroup> 
            </div>
            <div v-if="restricions.includes('Alergia (Especificar)')" class="w-full">
                <label for="outros">(Outros) Especifique</label>
                <InputGroup class="mt-2">
                    <InputText id="outros" type="text" v-model="otherRestrictions" />
                </InputGroup> 
            </div>
        </div>
        <div class="flex justify-between gap-12">
            <div class="w-full">
                <label for="usesMedication">Toma algum medicamento?</label>
                <InputGroup class="mt-2">
                    <SelectButton id="usesMedication" :options="['Não', 'Sim']" v-model="usesMedication" required/>
                </InputGroup> 
            </div>
            <div v-if="usesMedication === 'Sim'" class="w-full">
                <label for="outros">Especifique o(s) medicamento(s)</label>
                <InputGroup class="mt-2">
                    <InputText id="outros" type="text" v-model="medication" />
                </InputGroup> 
            </div>
        </div>
        <Button class="mt-4" label="Enviar" type="submit"/>
    </form>
</template>