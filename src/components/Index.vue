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
           
            Router.push('/home')
        },
        beforeDestroy() {

        },
        components: {

        }

}
</script>
<style>
</style>
