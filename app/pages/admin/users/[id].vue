<template>
    <div class="flex h-10/12 w-full">
        <div class="w-1/5 h-full">
            <chat-list/>
        </div>
        <div class="w-4/5 h-full">
            <chat-window/>
        </div>
    </div>
</template>

<script setup lang="ts">
    import {z} from 'zod'
    definePageMeta({
        validate(route){
            const {success} = z.uuid().safeParse(route.params.id)
            return success
        }
    })
</script>