<template>
  <div class="flex h-screen p-0 bg-white">
    <div class="w-1/2 bg-yellow-100 h-full border-r border-black flex flex-col">
      <div class="shrink-0">
        <Navbar />
      </div>
      <div
        v-if="imageChange"
        class="absolute flex justify-center items-center bg-black/20 w-full h-full"
      >
        <UserModel v-model:imageChange="imageChange" />
      </div>
      <!-- Scrollable UserList -->
      <div class="overflow-y-auto flex-1">
        <UserList v-model="selectedUser" />
      </div>
      <div >
        <Footer v-model:imageChange="imageChange" />
      </div>
    </div>

    <div class="w-full h-full bg-green-300">
      <div v-if="selectedUser" class="relative h-full flex flex-col">
        <ChatMessage :user="selectedUser" />

        <ChatInput />
      </div>

      <div v-else class="w-full flex items-center justify-center h-screen">
        <p>Welcome! Select a user to start chatting.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import UserList from '@/components/UserList.vue'
import ChatInput from '@/components/ChatInput.vue'
import ChatMessage from '@/components/ChatMessage.vue'
import Footer from '@/components/Footer.vue'
import UserModel from '@/components/UserModel.vue'

import { onMounted, ref, watchEffect } from 'vue'
import { collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore'
import { useUserChatStore } from '@/stores/chatStore'
import { auth, db } from '@/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'vue-router'

const store = useUserChatStore()
const selectedUser = ref(null)
const imageChange = ref(false)
const router = useRouter()
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      router.push('/')
    }
  })
})
watchEffect(() => {
  if (!store.user || !store.activeReceiver) return

  const sortedIds = [store.user.uid, store.activeReceiver.id].sort()
  const conversationId = `${sortedIds[0]}_${sortedIds[1]}`
  console.log(conversationId)
  //handle message update of receiver in real time
  const q = query(
    collection(db, 'conversation', conversationId, 'messages'),
    orderBy('timeStamp', 'asc'),
  )
  onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        store.pushSenderMessage(change.doc.data())
        const senderDoc = doc(db, 'users', store.activeReceiver.id)
        const receiverDoc = doc(db, 'users', store.user.uid)
        if (change.doc.data()) {
          store.activeReceiver.lastMessage = change.doc.data().text
          updateDoc(receiverDoc, {
            lastMessage: change.doc.data().text,
          })
          updateDoc(senderDoc, {
            lastMessage: change.doc.data().text,
          })
        }
      } else if (change.type === 'modified') {
        // Message edited
      } else if (change.type === 'removed') {
        // Message deleted
      }
    })
  })
})
</script>

<style scoped></style>
