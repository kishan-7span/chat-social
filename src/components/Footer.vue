<template>
  <div
    v-if="currentUser"
    class="w-full h-15 text-lg font-semibold flex items-center justify-between p-2 bg-white"
  >
    <p>Welcom, {{ currentUser }}</p>
    <button @click="auth.signOut()" class="bg-red-400 rounded-lg text-sm p-2">LogOut</button>
  </div>
</template>

<script setup>
import { auth } from '@/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { onMounted, ref, watchEffect } from 'vue'
const currentUser = ref('')
onAuthStateChanged(auth, () => {
  currentUser.value = auth.currentUser?.displayName
})
</script>

<style scoped></style>
