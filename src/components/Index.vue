<template>
    <q-layout>
        <div slot="header" class="toolbar green">
            <!-- opens left-side drawer using its ref -->
            <button class="hide-on-drawer-visible" @click="$refs.mainMenu.open()">
                <i>menu</i>
            </button>
            <q-toolbar-title :padding="1" class="text-center">
                <!-- <i class="material-icons">account_balance</i> -->
                {{ child_info.page_title }}
                <div><span style="font-size: 13px">{{ child_info.page_subtitle.toLowerCase() }}</span></div>
            </q-toolbar-title>
            <button v-if="fiper_component != null" class="green big" @click="fiper_component.$refs.fiperModal.open()">
                <i>note_add</i>
            </button>
        </div>
        <!-- Left-side Drawer -->
        <q-drawer ref="mainMenu">
            <div class="toolbar hide-on-drawer-visible green">
                <i class="material-icons">library_books</i>
                <q-toolbar-title>
                    Menu
                </q-toolbar-title>
            </div>
            <div class="list no-border platform-delimiter">
                <div class="list-label">Navigations</div>
                <button class="green full-width" @click="openDateModal()">
                    <i class="material-icons">date_range</i> Jump To Date
                </button>
                <div class="list-label">Main Menu</div>
                <q-drawer-link icon="home" :to="{path: '/home' , exact: true}">
                    Home
                </q-drawer-link>
                <q-drawer-link icon="trending_up" :to="{path: '/trending', exact: true}">
                    Trending
                </q-drawer-link>
                <q-drawer-link icon="developer_board" :to="{path: '/analysis' , exact: true}">
                    Analysis
                </q-drawer-link>
                <!-- <q-drawer-link icon="build" :to="{path: '/settings', exact: true}">
                    Settings
                </q-drawer-link> -->
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
        <q-modal ref="dateModal" class="minimized" :content-css="{padding: '50px'}">
            <h6>Select date to jump</h6>
            <!-- Only Date -->
            <div class="date-wrapper">
                <q-datetime v-model="date_value" type="date" class="sm-full-width"></q-datetime>
            </div>
            <button class="green" @click="submitDate()">Submit</button>
            <button class="secondary outline" @click="setToCurrentDate()">Today</button>
        </q-modal>
        <router-view class="layout-view"></router-view>
    </q-layout>
</template>
<script>
import {
    Utils
} from 'quasar'
import moment from 'moment'
import Router from '../router'
import Database from 'settings/database'
import Bus from 'settings/event-bus'
import {
    LocalStorage,
    SessionStorage
} from 'quasar'

export default {
    data: function() {
        return {
            fiper_component: null,
            child_info: {
                page_title: '',
                page_subtitle: ''
            },
            date: {},
            date_value: ''

        }
    },
    watch: {

    },
    computed: {

    },
    methods: {
        setToCurrentDate: function() {
            var that = this
            var current_date = new Date()
            that.$set(that, 'date_value', current_date.toISOString())
        },
        submitDate: function() {
            var that = this
            var date = new Date(that.date_value)
            console.log(date.getFullYear())
            console.log(date.getMonth() + 1)
            that.$refs.dateModal.close()
            that.$refs.mainMenu.close()
            var data = {
                month: (date.getMonth() + 1).toString(),
                year: date.getFullYear().toString(),
                day: date.getDate(),
                date_text: date.toISOString()
            }
            LocalStorage.set('current_date', data)
                // window.location.reload()
                // Router.push(that.$route.path)
            console.log(that.$route.path)
            Bus.$emit('change_date')
        },
        openDateModal: function() {
            var that = this
                // that.$refs.mainMenu.toggle()
            that.$refs.dateModal.open()
        },
        set_date: function() {
            var that = this
            var data = {}
            var _data = LocalStorage.get.item('current_date')
            if (_data != null) {
                console.log('current_date is not null')
                that.$set(that, 'date_value', _data.date_text)
            } else {
                var _date = moment().format()
                that.$set(that, 'date_value', _date)
            }

            console.log(that.date)
        },
    },
    created: function() {
        var that = this
            // Router.push('/home')
        Bus.$on('receive_child_info', function(data) {
            console.log('receive child info')
            that.$set(that, 'child_info', data)
        })
        Bus.$on('receive_fiper_component', function(component) {
            console.log('receive fiper component')
            that.$set(that, 'fiper_component', component)
        })
        Bus.$on('destroy_fiper_component', function() {
            that.$set(that, 'fiper_component', null)
        })

        that.set_date()
    },
    beforeDestroy() {
        Bus.$off('receive_fiper_component')
        Bus.$off('destroy_fiper_component')
        Bus.$off('receive_child_info')
        LocalStorage.remove('current_date')
    },
    components: {

    }

}
</script>
<style>
</style>
