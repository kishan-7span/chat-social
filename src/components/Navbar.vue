<template>
  <div class="border-b">
    <h1
      class="pl-6 text-2xl py-3 mb-5 font-bold relative inline-block after:content-[''] after:absolute after:left-6 after:bottom-0 after:h-[2px] after:w-36 after:bg-black"
    >
      ChatSocial
    </h1>
    <div class="w-96 mx-auto my-2 border rounded-full flex items-center">
      <Search :size="16" class="mx-2" />
      <input v-model="userName" class="outline-0 p-2" type="text" placeholder="Search user" />
    </div>
  </div>
</template>

<script setup>
import { Search } from 'lucide-vue-next'
import { ref, watch } from 'vue'
const userName = ref('')

let timer
const timeDelay = 2000

const handleUserSearch = () => {
  console.log(userName.value)
  //handle user search or filter
}

watch(userName, (value) => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    handleUserSearch()
  }, timeDelay)
})
</script>

<style scoped></style>
