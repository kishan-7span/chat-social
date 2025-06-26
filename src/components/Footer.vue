<template>
  <div
    v-if="currentUser.name"
    class="w-full h-15 text-lg font-semibold flex items-center justify-between p-2 bg-white"
  >
    <div class="flex items-center gap-2">
      <img
        :src="image"
        @click="() => $emit('update:imageChange', true)"
        class="size-12 border rounded-full object-cover cursor-pointer"
      />
      <p>Welcom, {{ currentUser.name }}</p>
    </div>
    <button @click="auth.signOut()" class="bg-red-400 rounded-lg text-sm p-2">LogOut</button>
  </div>
</template>

<script setup>
import { auth, db } from '@/firebase'
import { useUserListStore } from '@/stores/userList'
import { onAuthStateChanged } from 'firebase/auth'
import { onMounted, reactive, ref, watch, watchEffect } from 'vue'
import DefaultUser from '../../public/user.jpg'
import { doc, getDoc } from 'firebase/firestore'

const props = defineProps({ imageChange: Boolean })

// const imagechange = defineModel()
const users = useUserListStore()
const image = ref(DefaultUser)
const currentUser = reactive({
  id: '',
  name: '',
})
watch(
  () => props.imageChange,
  async (val) => {
    if (val === false && currentUser.id) {
      const snap = await getDoc(doc(db, 'users', currentUser.id))
      if (snap.exists()) {
        image.value = snap.data().avatar || image.value
      }
    }
  },
)
onAuthStateChanged(auth, () => {
  ;(currentUser.name = auth.currentUser.displayName), (currentUser.id = auth.currentUser.uid)
})
watchEffect(() => {
  if (currentUser.id) {
    getDoc(doc(db, 'users', currentUser.id)).then((user) => {
      if (user.exists()) {
        console.log(user.data())
        image.value = user.data().avatar || image.value
      }
    })
  }
})
</script>

<style scoped></style>
