import Vue from 'vue'
import VueRouter from 'vue-router'
import Database from 'settings/database'
Vue.use(VueRouter)

function load(component) {
    return () => System.import(`components/${component}.vue`)
}


var router = new VueRouter({
        /*
         * NOTE! VueRouter "history" mode DOESN'T works for Cordova builds,
         * it is only to be used only for websites.
         *
         * If you decide to go with "history" mode, please also open /config/index.js
         * and set "build.publicPath" to something other than an empty string.
         * Example: '/' instead of current ''
         *
         * If switching back to default "hash" mode, don't forget to set the
         * build publicPath back to '' so Cordova builds work again.
         */
        routes: [{
                path: '/',
                component: load('Index'),
                children: [
                    { path: '/home', component: load('main/Home'), },
                    { path: '/analysis', component: load('analysis/Analysis') },
                    { path: '/settings', component: load('main/Settings'), },
                    { path: '/trending', component: load('trending/Trend'), },
                ]
            }, // Default
            {
                path: '/login',
                component: load('auth/Auth'),

            },
            { path: '/about', component: load('main/About'), },

            // { path: '/fiper/:id', component: load('finance-performance/Fiper') },
            { path: '/pinreset', component: load('auth/PinChange'), },

            { path: '/setup', component: load('main/SetupPin'), },
            { path: '/logout', component: load('auth/Logout') },
            { path: '*', component: load('Error404') }, // Not found

        ]
    })
    // Middleware for router
router.beforeResolve((to, from, next) => {
    console.log("To: " + to.fullPath)
    console.log("From: " + from.fullPath)
        // Setup PIN CODE for the first time
    Database.get("first_login").then(function(doc_first_login) {
        console.log(doc_first_login)
        if (doc_first_login.status) {
            if (to.fullPath == '/setup') {
                next()
                return false
            }
            next('/setup')
            return false
        } else {
            // // Default redirect
            if (to.fullPath == '/') {
                next('/home')
                return false
            }
            // Required /setup to redirect to home, fuck, and this is default
            if (to.fullPath == '/setup') {
                next('/')
                return false
            }

            // Not required from login
            if (to.fullPath == '/pinreset') {
                next()
                return false
            }

            // Process required login routes
            Database.get('pin_code').then(function(doc) {
                    // console.log(doc)
                    if (!doc.is_authed) {
                        // doc is not authed, then redirect to login
                        // If redirect to login, so keep redirect
                        if (to.fullPath == '/login') {
                            next()
                            return false
                        }
                        next('/login')
                    } else {
                        // If doc is authed and redirect to /login
                        // Return to home
                        // Else keep redirect to target
                        if (to.fullPath == '/login') {
                            next('/')
                            return false
                        }
                        next()
                    }
                    return false
                }).catch(function(err) {
                    console.log(err)
                })
                // After all, return false to stop all actions
        }

    }).catch(function(err) {
        console.log(err)
        if (err.name === 'not_found') {
            console.log("not found, must be initialized")
        } else { // hm, some other error
            throw err
        }

    })



})

export default router
