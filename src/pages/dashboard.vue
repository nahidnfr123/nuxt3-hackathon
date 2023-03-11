<template>
  <Container>
    <h1 class="my-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl text-center">Dashboard</h1>
    {{ users }}

  </Container>
</template>

<script setup>
import Container from "~/components/common/Container.vue";
import $api from "~/composables/useRequest";

const users = ref([])
definePageMeta({
  middleware: ["require-auth"]
})


const {data} = $api.get('/users')
console.log(data?.value)

</script>
