import { defineStore } from 'pinia'

export const useUserListStore = defineStore('user', {
  state: () => ({
    userList :[]
  }),
  actions: {
    addUserList(users) {
      this.userList = [...users]
    },
  },
})


