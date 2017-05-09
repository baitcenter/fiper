// === DEFAULT / CUSTOM STYLE ===
// WARNING! always comment out ONE of the two require() calls below.
// 1. use next line to activate CUSTOM STYLE (./src/themes)
// require(`./themes/app.${__THEME}.styl`)
// 2. or, use next line to activate DEFAULT QUASAR STYLE
require(`quasar/dist/quasar.${__THEME}.css`)
require('./statics/animate.css')
    // ==============================

import Vue from 'vue'
import Quasar from 'quasar'
import router from './router'
import { Database } from 'settings/settings'
import Vuelidate from 'vuelidate'

router.beforeEach((to, from, next) => {
    console.log(to.fullPath)

    Database.get('pin_code').then(function(doc) {
        console.log(doc)

        if (!doc.is_authed) {
            if (to.fullPath == '/login') {
                next()
            }
            next('/login')
        } else {
            if (to.fullPath == '/login') {
                next('/home')
            }
            next()
        }
    }).catch(function(err) {
        console.log(err)
    })
})

Vue.use(Quasar) // Install Quasar Frameworks
Vue.use(Vuelidate)

// Vue.use(VueMaterial);
Quasar.start(() => {
    /* eslint-disable no-new */
    new Vue({
        el: '#q-app',
        data: function() {
            return {
                database: Database
            }
        },
        mounted: function() {
            this.database.info().then(function(result) {
                // handle result
                console.log(result)
            }).catch(function(err) {
                console.log(err)
            });
        },
        router,
        render: h => h(require('./App')),
        Vuelidate
    })
})
