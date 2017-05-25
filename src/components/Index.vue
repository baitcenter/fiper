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
                    <i>home</i> Jump To Date
                </button>
                <div class="list-label">Main Menu</div>
                <q-drawer-link icon="home" :to="{path: '/home/' + date.year + '/' + date.month, exact: true}">
                    Home
                </q-drawer-link>
                <q-drawer-link icon="trending_up" :to="{path: '/trending/' + date.year , exact: true}">
                    Trending
                </q-drawer-link>
                <q-drawer-link icon="developer_board" :to="{path: '/analysis/' + date.year + '/' + date.month, exact: true}">
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
        <q-modal ref="dateModal" class="minimized" :content-css="{padding: '50px'}">
            <h4>Select date to jump</h4>
            <!-- Only Date -->
            <q-datetime v-model="date_value" type="date" class="sm-full-width"></q-datetime>
            <button class="green" @click="submitDate()">Submit</button>
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
export default {
    data: function() {
        return {
            fiper_component: null,
            child_info: {
                page_title: '',
                page_subtitle: ''
            },
            date: {},
            date_value: moment().format()

        }
    },
    watch: {
        '$route': {
            handler: function(to, from) {
                var that = this
                that.set_date()
                console.log(to)
                if (that.$route.path == ('/' + that.date.year + '/' + that.date.month))
                    Router.push('/home' + that.$route.path)
            }
        }
    },
    computed: {

    },
    methods: {
        submitDate: function() {
            var that = this
            var date = new Date(that.date_value)
            console.log(date.getFullYear())
            console.log(date.getMonth() + 1)

            that.$refs.dateModal.close()
            that.$refs.mainMenu.close()
            console.log('starting push')
            Router.push('/' + date.getFullYear().toString() + '/' + (date.getMonth() + 1).toString())
        },
        openDateModal: function() {
            var that = this
                // that.$refs.mainMenu.toggle()
            that.$refs.dateModal.open()
        },
        set_date: function() {
            var that = this
                // react to route changes...
            console.log('month: ' + that.$route.params.month)
            console.log('year: ' + that.$route.params.year)
            console.log('day: ' + that.$route.params.day)

            if (typeof that.$route.params.month !== 'undefined' && typeof that.$route.params.year !== 'undefined') {
                // console.log('1st')
                // Check conditions
                if (!((that.$route.params.month < 1 || that.$route.params.month > 12) || (that.$route.params.year < 0))) {


                    var data = {
                            year: that.$route.params.year,
                            month: that.$route.params.month
                        }
                        // console.log(data)
                    that.$set(that, 'date', data)
                }

            } else {
                console.log('here')
                var _date = moment().format()
                var date = new Date(_date)
                var data = {
                        month: date.getMonth() + 1,
                        year: date.getFullYear(),
                        current: true
                    }
                    // console.log(data)
                that.$set(that, 'date', data)
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
        console.log('receive push')
        if (that.$route.path == ('/' + that.date.year + '/' + that.date.month))
            Router.push('/home' + that.$route.path)
    },
    beforeDestroy() {
        Bus.$off('receive_fiper_component')
        Bus.$off('destroy_fiper_component')
        Bus.$off('receive_child_info')
    },
    components: {

    }

}
</script>
<style>
</style>
