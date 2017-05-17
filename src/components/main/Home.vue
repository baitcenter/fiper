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
            </q-toolbar-title>
        </div>
        <!-- Left-side Drawer -->
        <q-drawer ref="leftDrawer">
            <div class="toolbar hide-on-drawer-visible green">
                <i class="material-icons">library_books</i>
                <q-toolbar-title>
                    Menu
                </q-toolbar-title>
            </div>
            <div class="list no-border platform-delimiter">
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
        <button class="primary green circular fixed-bottom-right btn-primary big " @click="$refs.maximizedModal.open()">
            <i>add</i>
        </button>
        <!-- Modal add -->
        <q-modal ref="maximizedModal" class="maximized" :content-css="{padding: '50px'}">
            <q-layout>
                <div slot="header" class="toolbar green">
                    <button @click="$refs.maximizedModal.close()">
                        <i>keyboard_arrow_left</i>
                    </button>
                    <q-toolbar-title :padding="1">
                        Create new Fiper
                    </q-toolbar-title>
                </div>
                <div class="layout-view">
                    <div class="layout-padding">
                        <add-finance></add-finance>
                        <button class="primary green" @click="$refs.maximizedModal.close()">Close</button>
                    </div>
                </div>
            </q-layout>
        </q-modal>
        <!-- Router view here -->
        <router-view></router-view>
        <!-- <button class="primary green" @click="add">Click to log</button> -->
    </q-layout>
</template>
<script type="text/javascript">
import Database from 'settings/database'
import Router from 'root_dir/router'
import AddFinance from 'components/finance-performance/AddNew'
export default {
    data: function() {
        return {
            min: 0,
            max: 20,
            model: 5,
            text: ''
        }
    },
    mounted: function() {
        // this.$set('text', this.$parent.global_text)
        var that = this
            // console.log(that.$parent)
            // console.log(that.$parent.global_text)
            // Database.get("pin_code").then(function(doc) {
            //     console.log(doc)
            //     if (!doc.is_authed) {
            //         Router.push('/login')
            //     }
            // }).catch(function(err) {
            //     Router.push('/login')
            // })
    },
    methods: {
        add: function() {
            this.model++;
            var that = this
                // console.log(that.$parent.global_text)
                // that.$parent.$emit('test', 'hello world')

        }
    },
    components: {
        AddFinance
    }
}
</script>
<style type="text/css">
</style>
