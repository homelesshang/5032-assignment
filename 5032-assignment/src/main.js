import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/main.css'


import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initializeApp } from 'firebase/app'


const firebaseConfig = {
  apiKey: 'AIzaSyAZnIG0rn9CeOBGomjZCI5zK_tESvr1oEk',
  authDomain: 'assignment-6cbd1.firebaseapp.com',
  projectId: 'assignment-6cbd1',
  storageBucket: 'assignment-6cbd1.appspot.com', 
  messagingSenderId: '704094943516',
  appId: '1:704094943516:web:dbb97341dee29af4d6a2d9',
  measurementId: 'G-Q3FZ87MXRV' 
}

initializeApp(firebaseConfig)

const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})

app.use(router)

app.mount('#app')