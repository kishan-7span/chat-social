<template>
  <div class="h-full w-full overflow-y-scroll bg-yellow-200/60">
    <div v-if="user" class="fixed block w-full bg-white h-15 text-black p-4">
      <h2>{{ user.name }}</h2>
    </div>
    <div v-if="user && history" class="pt-16">
      <div v-for="(message, index) in history" :key="index">
        <div
          v-if="message.receiverId === activeUsers.user.uid"
          class="w-full p-2 flex justify-start"
        >
          <div class="w-fit max-w-[50%] h-auto bg-gray-300 px-3 py-2 rounded-lg">
            <p>{{ message.text }}</p>
          </div>
        </div>
        <div v-else class="w-full h-full p-2 flex justify-end">
          <div class="w-fit max-w-[50%] h-auto bg-blue-400/80 px-3 py-2 rounded-lg">
            <p>{{ message.text }}</p>
          </div>
        </div>
      </div>
      <div ref="chatEnd" />
    </div>
  </div>
</template>

<script setup>
import { db } from '@/firebase'
import { useUserChatStore } from '@/stores/chatStore'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from 'firebase/firestore'
import { nextTick, onMounted, ref, watch, watchEffect } from 'vue'

const activeUsers = useUserChatStore()
const user = ref(null)
const chatEnd = ref(null)
const selectedUser = defineProps(['user'])
const sortedIds = [activeUsers.user.uid, activeUsers.activeReceiver.id].sort()
const conversationId = `${sortedIds[0]}_${sortedIds[1]}`
const history = ref(null)
onMounted(async () => {
  console.log("render MESSAGE")
  const conversationRef = doc(db, 'conversation', conversationId)
  //it will get conversation document from database
  const snap = await getDoc(conversationRef)
  //check if it's exist or not
  if (!snap.exists()) {
    await setDoc(conversationRef, {
      users: [activeUsers.user.uid, activeUsers.activeReceiver.id],
      updatedAt: new Date(),
    })
    console.log('Conversation created successfully')
  } else {
    console.log('Conversation already exists')
  }

  //will get selected chat user
  const userRef = doc(db, 'users', selectedUser.user)
  const userSnap = await getDoc(userRef)
  //and set that user to globally
  if (userSnap.exists()) {
    user.value = userSnap.data()
  }

  const q = query(
    collection(db, 'conversation', conversationId, 'messages'),
    orderBy('timeStamp', 'asc'),
  )
  //get all conversation to chat box
  const snapshot = await getDocs(q)
  const entireConversation = snapshot.docs.map((snap) => ({ id: snap.id, ...snap.data() }))
  console.log(entireConversation)
  activeUsers.addEntierConversation(entireConversation)
})

watch(activeUsers, () => {
  history.value = activeUsers.EntierConversation[conversationId]
})

watchEffect(() => {
  if (history.value?.length) {
    nextTick(() => {
      chatEnd.value?.scrollIntoView({ behavior: 'smooth' })
    })
  }
})
</script>

<style scoped></style>
