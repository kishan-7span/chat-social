import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useUserChatStore = defineStore('chat', {
  state: () => ({
    conversation: {}, // receiver chats by receiverId
    activeReceiver: null, // receiver user object
    user: null, // sender user object
    messages: {}, // sender messages by receiverId
    EntierConversation: reactive({}),
  }),
  actions: {
    // called when opening chat with a receiver
    addUsers({ senderId, receiverId }) {
      this.user = senderId
      this.activeReceiver = receiverId
      const key = [senderId.uid, receiverId.id].sort().join('_')

      //skip this state for now 21/june
      // if (!this.messages[senderId]) this.messages[senderId] = []
      // if (!this.conversation[receiverId]) this.conversation[receiverId] = []

      if (!this.EntierConversation[key]) this.EntierConversation[key] = []
    },
    // add conversation from both end
    addEntierConversation(conversation) {
      console.log(conversation, 'conversation in chat store')
      if (!this.activeReceiver && !this.user) return
      const key = [this.activeReceiver.id, this.user.uid].sort().join('_')

      this.EntierConversation[key] = conversation
    },

    //push new added conversation to array
    pushSenderMessage(chat) {
      if (!this.activeReceiver || !this.user) return
      const key = [this.activeReceiver.id, this.user.uid].sort().join('_')

      if (!this.EntierConversation[key]) this.EntierConversation[key] = []

      this.EntierConversation[key].push(chat)
    },

    // temp muted date 21/june
    // add message sent by the current user
    // addMessage(chat) {
    //   if (!this.activeReceiver) return
    //   this.messages[this.activeReceiver].push(chat)
    // },

    // // add message received from the receiver
    // addReceiverMessage(chat) {
    //   if (!this.activeReceiver) return

    //   this.conversation[this.activeReceiver].push(...chat)
    // },

    // clear both sender and receiver chats
    clearMessages() {
      if (this.activeReceiver) {
        this.messages[this.activeReceiver] = []
        this.conversation[this.activeReceiver] = []
      }
    },
  },
})
