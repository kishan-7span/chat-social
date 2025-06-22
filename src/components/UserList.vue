<template>
  <div class="w-full py-1 px-5" v-for="user in store.userList" :key="user.id">
    <div
      :class="{ 'bg-secondary/30': selectedUserId === user.id }"
      @click="handleStartChat(user.id)"
      class="after:border-b after:w-full after:border-black hover:bg-secondary/30 px-3 py-3 rounded-lg cursor-pointer"
    >
      <div class="flex items-start justify-between">
        <div class="w-full flex items-center gap-2">
          <img :src="Social" width="13%" class="h-10 border rounded-full object-cover" />
          <ul>
            <li>{{ user.name }}</li>
            <li class="text-zinc-600 text-sm">{{ user.lastMessage }}</li>
          </ul>
        </div>
        <p class="text-xs text-zinc-600">{{ user.lastActive.slice(',') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import Social from '../../public/social.jpg'
import { collection, getDocs } from 'firebase/firestore'
import { auth, db } from '@/firebase'
import { useUserListStore } from '@/stores/userList'
import { useUserChatStore } from '@/stores/chatStore'
const selectedUserId = ref(null)
const store = useUserListStore()
const chatStore = useUserChatStore()

const selectUser = defineModel()
onMounted(() => {
  const getUser = async () => {
    const response = await getDocs(collection(db, 'users'))
    const user = response.docs.map((user) => ({
      id: user.id,
      ...user.data(),
    }))
    const filterUsers = computed(() =>
      user
        .filter((user) => user.id !== auth.currentUser.uid)
        .map((user) => ({
          ...user,
          lastActive: user.lastActive?.toDate().toLocaleDateString() || 'N/A',
        })),
    )
    store.addUserList(filterUsers.value)
  }
  getUser()
})

const handleStartChat = (id) => {
  if (selectedUserId.value == id) return
  selectedUserId.value = id
  selectUser.value = id
  chatStore.addUsers({ senderId: auth.currentUser.uid, receiverId: id })
}
</script>

<style scoped></style>
