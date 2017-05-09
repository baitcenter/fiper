<template>
    <router-view></router-view>
</template>
<script>
import {
    Utils
} from 'quasar'

import Router from '../router'
import Database from 'settings/database'

export default {
    data() {
            return {
                id: Utils.uid(),
            }
        },
        computed: {

        },
        methods: {

        },
        mounted() {
            // Database.get("pin_code").then(function(doc) {
            //     console.log(doc)
            //     if (!doc.is_authed) {

            //         Router.push('/login')

            //     } else {
            //         Router.push('/home')
            //     }
            // }).catch(function(err) {
            //     Router.push('/login')
            // })
        },
        beforeDestroy() {

        },
        components: {

        }

}
</script>
<style>
</style>
