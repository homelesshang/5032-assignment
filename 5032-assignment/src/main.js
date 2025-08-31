import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/main.css'


import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})

app.use(router)

app.mount('#app')