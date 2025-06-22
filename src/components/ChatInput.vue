`
<template>
  <div class="w-full h-min py-2 flex items-center justify-between bg-yellow-100">
    <div class="w-full flex mx-2 gap-2 items-end border rounded-lg px-2">
      <Keyboard class="mb-3" :size="16" />
      <textarea
        v-model="chat"
        rows="1"
        @input="autoResize"
        @keydown="handleKeyDown"
        class="outline-0 py-2 w-full resize-none overflow-auto max-h-32"
        placeholder="Type a message..."
      />
      <span
        @click="handleSubmit"
        :class="{ hidden: isEnter }"
        class="border rounded-full p-1 mb-1.5 bg-green-400"
        ><SendHorizonal :size="20"
      /></span>
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
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore'
import { Keyboard, SendHorizonal } from 'lucide-vue-next'
import { ref, watch } from 'vue'
const selectedUser = defineProps(['user'])
const isEnter = ref(true)
const { user, activeReceiver, pushSenderMessage } = useUserChatStore()

const chat = ref('')
watch(chat, (value) => {
  if (value.trim() !== '') {
    isEnter.value = false
    return
  }
  isEnter.value = true
})
const sortedIds = [user.uid, activeReceiver.id].sort()
const conversationId = `${sortedIds[0]}_${sortedIds[1]}`

const handleSubmit = async () => {
  const chatValue = chat.value.trim()

  chat.value = ''
  if (chatValue !== '') {
    const ref = doc(db, 'conversation', conversationId)
    const snap = await getDoc(ref)

    const messageData = {
      senderId: user.uid,
      receiverId: activeReceiver.id,
      text: chatValue,
      timeStamp: new Date(),
    }
    //this will store value to conversation collection->subcollection message in firebase
    if (snap.exists()) {
      await addDoc(collection(db, 'conversation', conversationId, 'messages'), messageData)
    }
  }
}

const handleKeyDown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSubmit()
  }
}

const autoResize = (e) => {
  const el = e.target
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight}px`
}
</script>

<style scoped></style>
`
