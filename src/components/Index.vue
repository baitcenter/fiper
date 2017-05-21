<template>
    <q-layout>
        <div slot="header" class="toolbar green">
            <!-- opens left-side drawer using its ref -->
            <button class="hide-on-drawer-visible" @click="$refs.leftDrawer.open()">
                <i>menu</i>
            </button>
            <q-toolbar-title :padding="1" class="text-center">
                <!-- <i class="material-icons">account_balance</i> -->
                Finance Performance
                <div><span style="font-size: 13px">today</span></div>
            </q-toolbar-title>
            <button class="green big" @click="$refs.fiperModal.open()">
                <i>note_add</i>
            </button>
        </div>
        <router-view class="layout-view"></router-view>
        <!-- Left-side Drawer -->
        <q-drawer ref="leftDrawer">
            <div class="toolbar hide-on-drawer-visible green">
                <i class="material-icons">library_books</i>
                <q-toolbar-title>
                    Menu
                </q-toolbar-title>
            </div>
            <div class="list no-border platform-delimiter">
                <q-drawer-link icon="home" :to="{path: '/home', exact: true}">
                    Home
                </q-drawer-link>
                <q-drawer-link icon="developer_board" :to="{path: '/analysis', exact: true}">
                    Analysis
                </q-drawer-link>
                <q-drawer-link icon="build" :to="{path: '/settings', exact: true}">
                    Settings
                </q-drawer-link>
                <q-drawer-link icon="cached" :to="{path: '/pinreset', exact: true}">
                    Reset PIN
                </q-drawer-link>
                <q-drawer-link icon="face" :to="{path: '/about', exact: true}">
                    About Fiper
                </q-drawer-link>
                <q-drawer-link icon="exit_to_app" :to="{path: '/logout', exact: true}">
                    Logout
                </q-drawer-link>
            </div>
        </q-drawer>
    </q-layout>
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
