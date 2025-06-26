<template>
  <div class="z-10 bg-white rounded-lg w-96 h-fit p-2">
    <h1 class="text-2xl font-semibold">Profile Image</h1>
    <input
      id="imageInput"
      type="file"
      accept="image/*"
      @change="handleImageChange"
      class="hidden my-3"
    />
    <label for="imageInput">
      <img :src="image" class="rounded-xl border object-cover size-64 mx-auto my-3" />
    </label>
    <button @click="toggleImageChange" class="bg-green-400 p-3 rounded-lg">Save</button>
  </div>
</template>

<script setup>
import { onMounted, ref, watchEffect } from 'vue'
import DefaultUser from '../../public/user.jpg'
import { getDownloadURL, ref as storeRef, getStorage, uploadBytes } from 'firebase/storage'
import { useUserChatStore } from '@/stores/chatStore'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/firebase'
const props = defineProps({ imageChange: Boolean })
const emit = defineEmits(['update:imageChange'])

const toggleImageChange = () => {
  emit('update:imageChange', !props.imageChange)
}

const image = ref(DefaultUser)
const currentUser = doc(db, 'users', auth.currentUser.uid)

onMounted(() => {
  getDoc(currentUser).then((user) => {
    if (user.exists()) {
      const avatar = user.data().avatar
      image.value = avatar || DefaultUser
    }
  })
})

const handleImageChange = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  if (file.size > 1 * 1024 * 1024) {
    alert('Image must be less than 1 MB')
    return
  }
  image.value = URL.createObjectURL(file)
  const base64 = await toBase64(file)
  updateDoc(currentUser, {
    avatar: base64,
  })
}

const toBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}
</script>

<style scoped></style>
