// === DEFAULT / CUSTOM STYLE ===
// WARNING! always comment out ONE of the two require() calls below.
// 1. use next line to activate CUSTOM STYLE (./src/themes)
// require(`./themes/app.${__THEME}.styl`)
// 2. or, use next line to activate DEFAULT QUASAR STYLE
require(`quasar/dist/quasar.${__THEME}.css`)
require('./statics/animate.css')
require('./statics/app.css')

// ==============================

import Vue from 'vue'
import Quasar from 'quasar'
import router from './router'
import { Database } from 'settings/settings'
import Vuelidate from 'vuelidate'
import Bus from 'settings/event-bus'



Vue.use(Quasar) // Install Quasar Frameworks
Vue.use(Vuelidate)

// Vue.use(VueMaterial);
Quasar.start(() => {
    /* eslint-disable no-new */
    new Vue({
        el: '#q-app',
        router,
        render: h => h(require('./App')),
    })
})
