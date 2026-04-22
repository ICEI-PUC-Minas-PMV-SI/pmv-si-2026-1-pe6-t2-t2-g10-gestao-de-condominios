import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import { useTheme } from './composables/use-theme'
import { router } from './router'
import './styles/main.css'

useTheme()

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')
