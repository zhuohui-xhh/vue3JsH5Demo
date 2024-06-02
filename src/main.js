import './assets/main.css'
import 'normalize.css' // 新增-安装公共样式
import './styles/index.scss' // 新增
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
