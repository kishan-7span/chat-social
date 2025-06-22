import { createRouter, createWebHistory } from 'vue-router'
import LoginView from "../views/LoginView.vue"
import CharRoomView from "../views/ChatRoomView.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/chat',
      name: 'chat',
      component: CharRoomView,
    },
    
  ],
})

export default router
