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
        <button class="primary green circular fixed-bottom-right btn-primary big " @click="$refs.fiperModal.open()">
            <i>add</i>
        </button>
        <!-- Modal add -->
        <q-modal ref="fiperModal" class="maximized" :content-css="{padding: '50px'}">
            <q-layout>
                <div slot="header" class="toolbar green">
                    <button @click="$refs.fiperModal.close()">
                        <i>keyboard_arrow_left</i>
                    </button>
                    <q-toolbar-title :padding="1">
                        Create new Fiper
                    </q-toolbar-title>
                </div>
                <div class="layout-view">
                    <div class="layout-padding">
                        <add-finance v-on:set_fiper_data="setFiperData" v-on:submit_fiper_data="setFiperData"></add-finance>
                        <button class="primary outline green" @click="submitFiperData">Set</button>
                        <button class="secondary green" @click="closeFiperModal">Back</button>
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
            fiper_data: {
                data: '',
                instance: ''
            }
        }
    },
    mounted: function() {
        // this.$set('text', this.$parent.global_text)
        var that = this
    },
    methods: {
        setFiperData: function(data) {
            var that = this
                // console.log(data)
            try {
                that.$set(that.fiper_data, 'data', data.data)
                that.$set(that.fiper_data, 'instance', data.instance)
            } catch (err) {
                console.log(err)
            }
        },
        submitFiperData: function(data) {
            var that = this
            console.log(that.fiper_data.data)
            try {
                that.fiper_data.instance.$emit('reset_fiper_data')
                that.addNewFiper()
            } catch (err) {
                console.log(err)
            }
            that.closeFiperModal()
            console.log(that.fiper_data.data)

        },
        closeFiperModal: function() {
            var that = this
            that.$refs.fiperModal.close()
        },
        addNewFiper: function() {
            var that = this
                // Setup fiper for the first time
            var data = that.fiper_data.data
            Database.get("fiper").then(function(fiper) {
                fiper.data.push(data)
                return Database.put(fiper).then(function(new_fiper) {
                        console.log('update ' + new_fiper.id + ' success fully')
                        console.log(new_fiper)
                    }).catch(function(err) {
                        console.log(err)
                    })
                    // console.log(doc)
            }).catch(function(err) {
                console.log(err)
                if (err.name === 'not_found') {
                    console.log("not found, must be initialized")
                } else { // hm, some other error
                    throw err
                }

            })
        },
    },
    components: {
        AddFinance
    }
}
</script>
<style type="text/css">
</style>
