import { createApp } from 'vue'
import App from './App.vue'

/* import modules here */
import VueCookies from 'vue-cookies'
/* end import modeules */

const app = createApp(App)

/* apply modules here  */
app.use(VueCookies)
/* end use modules     */

app.mount('#app')
