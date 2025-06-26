<template>
  <div class="w-full h-full overflow-hidden">
    <div
      id="loagin-view"
      :class="{
        'relative before:content-[\'Redirecting\'] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:text-white before:bg-black before:flex before:items-center before:justify-center before:w-full before:h-full  before:text-3xl before:opacity-50 before:z-10':
          loading,
      }"
      class="w-full flex gap-2 bg-white outline-7 outline-primary -outline-offset-8 h-10/12 rounded-2xl p-8"
    >
      <div class="w-1/2 flex flex-col justify-center gap-3 rounded-xl p-8 py-10">
        <span
          class="relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-32 after:bg-black text-4xl font-bold py-2"
        >
          Login
        </span>
        <h1 class="w-full text-2xl font-extrabold">Hello <br /><span>Welcome back</span></h1>
        <form @submit.prevent="handleSubmit">
          <div class="flex flex-col gap-4">
            <div class="flex items-center border border-black rounded-lg px-2">
              <Mail :size="16" /><input
                v-model="email"
                type="email"
                class="w-full p-2 outline-0"
                placeholder="Enter Email"
                :disabled="loading"
              />
            </div>
            <p v-if="error.email && email !== ''" class="p-0 m-0 text-red-400">
              Please Enter Valid Email
            </p>
            <div class="flex items-center border border-black rounded-lg px-2">
              <Key :size="16" /><input
                v-model="password"
                type="password"
                class="w-full p-2 outline-0"
                placeholder="Password"
                :disabled="loading"
                @keydown.space.prevent
              />
            </div>
          </div>
          <button
            :disabled="loading"
            type="submit"
            class="bg-green-300 rounded-xl py-2 px-3 w-min my-3"
          >
            Submit
          </button>
        </form>
        <div v-if="error.password">
          <p :class="error.hasMinLetters ? 'text-red-400' : 'text-green-400'" class="p-0 m-0">
            Include atleast 4 letter
          </p>
          <p :class="error.hasSpecialChar ? 'text-red-400' : 'text-green-400'" class="p-0 m-0">
            Should use special
          </p>
          <p :class="error.hasNumber ? 'text-red-400' : 'text-green-400'" class="p-0 m-0">
            Indlude numbers
          </p>
          <p :class="error.isMinLength ? 'text-red-400' : 'text-green-400'" class="p-0 m-0">
            Minimum length should be 8 character
          </p>
        </div>
      </div>

      <div class="w-1/2 h-full overflow-hidden rounded-xl">
        <img :src="Scoical" class="size-full object-cover object-center" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { Mail, Key } from 'lucide-vue-next'
import Scoical from '../../public/social.jpg'
import { onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth, db } from '@/firebase'
import { computed, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Timestamp, doc, getDoc, setDoc } from 'firebase/firestore'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = reactive({
  email: false,
  password: false,
  hasMinLetters: false,
  hasSpecialChar: false,
  hasNumber: false,
  isMinLength: false,
})

const letterRegex = /^[A-Za-z]{4,}/
const specialCharRegex = /[!@#$%^&*()]/
const numberRegex = /.*[0-9]/
const minLengthRegex = /^.{8,10}$/

watch(email, (value) => {
  const regex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/
  console.log('called after')
  if (!value.trim() === '') {
    error.email = false
    return
  }
  if (!regex.test(value.trim())) {
    error.email = true
    return
  }
  error.email = false
})

watch(password, (value) => {
  if (value.trim() === '') {
    error.password = false
    return
  }
  error.hasMinLetters = !letterRegex.test(value)
  error.hasSpecialChar = !specialCharRegex.test(value)
  error.isMinLength = !minLengthRegex.test(value)
  error.hasNumber = !numberRegex.test(value)
  error.password =
    error.hasMinLetters || error.hasSpecialChar || error.hasNumber || error.isMinLength
})

const handleSubmit = async () => {
  loading.value = true

  const computedErrorState = computed(() => Object.values(error).some((val) => val))
  if (computedErrorState.value) return
  const emailVal = email.value
  const passwordVal = password.value
  email.value = ''
  password.value = ''
  try {
    if (emailVal.trim() !== '' && passwordVal.trim() !== '') {
      await signInWithEmailAndPassword(auth, emailVal, passwordVal)
      await updateProfile(auth.currentUser, {
        displayName: emailVal.toLowerCase().startsWith('kishan') ? 'Kishan' : 'Admin',
      })
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userRef = doc(db, 'users', user.uid)
          const snap = await getDoc(userRef)
          if (!snap.exists()) {
            syncUserToFireBase({ user })
          }
        }
      })

      console.log('Login success')
      router.push('/chat')
      loading.value = false
      return
    }
    loading.value = false
    return alert('Please enter valid email and password')
  } catch (error) {
    console.error(error)
  }
}

const syncUserToFireBase = async ({ user }) => {
  await setDoc(doc(db, 'users', user.uid), {
    name: user.displayName,
    lastActive: Timestamp.now(),
    email: user.email,
    uid: user.uid,
  })
}
</script>

<style scoped></style>
