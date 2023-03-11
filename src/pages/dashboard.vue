<template>
  <Container>
    <h1 class="my-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl text-center">Dashboard</h1>

    <!--    <template v-if="!loading">-->
    <div v-if="users && users.length">
      <h2 class="text-2xl mb-2">Loaded "<strong class="text-blue-300">{{ users.length }}</strong> user's" from DB</h2>
      <table class="table-auto w-full">
        <thead>
        <tr class="bg-gray-100">
          <th class="px-4 py-2">Name</th>
          <th class="px-4 py-2">Email</th>
          <th class="px-4 py-2">Phone</th>
          <th class="px-4 py-2">Joined Date</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(user, u) in users" :class="u%2 ? 'bg-gray-100' : ''">
          <td class="border px-4 py-2">{{ user.name }}</td>
          <td class="border px-4 py-2">{{ user.email }}</td>
          <td class="border px-4 py-2">{{ user.phone }}</td>
          <td class="border px-4 py-2">{{ user.created_at }}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <!--    </template>-->
  </Container>
</template>

<script setup>
import Container from "~/components/common/Container.vue";
import $api from "~/composables/useRequest";

const users = ref([])
const loading = ref(false)
definePageMeta({
  middleware: ["require-auth"]
})

// const {data} = await $api.get('user')
// onMounted(() => {

// })

const init = () => {
  loading.value = true
  const config = useRuntimeConfig()
  const {data} = useFetch(config.public.apiBaseUrl + 'users')
// console.log(data.value)
  users.value = data?.value?.data
  loading.value = false
}
init()
// const {data} = response
// console.log(data)
// onMounted(() => {
// })
</script>
