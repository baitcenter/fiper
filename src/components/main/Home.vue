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
        <!-- Modal add -->
        <q-modal ref="fiperModal" class="maximized" :content-css="{padding: '50px'}">
            <q-layout>
                <div slot="header" class="toolbar green">
                    <button @click="closeFiperModal">
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
                        <button class="secondary green" @click="closeFiperModal">Cancel</button>
                    </div>
                </div>
            </q-layout>
        </q-modal>
        <div class="layout-view">
            <div v-for="(fiper_value,fiper_key) in fiper_data" class="fiper-wrapper" :id="'fiper-' + fiper_key">
                <div v-for="(value,index) in fiper_value" class="card flex items-center wrap justify-start">
                    <div class="row full-width auto">
                        <div class="tag label bg-green text-white float-left">{{ value.fiper_type_name }}</div>
                    </div>
                    <div class="card-title row wrap auto items-center">
                        <h2>{{ value.fiper_amount }} USD</h2>
                    </div>
                    <div class="row auto sm-width-1of3 justify-end">
                        <div class="fiper-action float-right row">
                            <div class="circular small fiper-logo-wrapper">
                                <img class="button fiper-logo small" :src="get_fiper_type_img(value,index,fiper_key)">
                            </div>
                            <button class="green circular small outline"><i class="material-icons">edit</i></button>
                            <button class="green circular small" @click="removeFiper(value,index,fiper_key)"><i class="material-icons">delete</i></button>
                        </div>
                    </div>
                    <div class="full-width auto">
                        <div class="row full-width auto wrap">
                            <div class="row fiper-data self-stretch full-width auto">
                                <div class="card-content wrap auto">
                                    <h5> {{ value.fiper_name }}</h5>
                                    <div>{{ value.fiper_des }}</div>
                                </div>
                            </div>
                            <div class="row full-width auto items-center fiper-extra-info">
                                <div class="float-left auto">{{ get_fiper_date(value) }}</div>
                                <div class="fiper-root-type chip label bg-grey-4 float-right">
                                    {{ fiper_root_type[fiper_key].text }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <button class="primary green circular fixed-bottom-right btn-primary big " @click="$refs.fiperModal.open()">
            <i>add</i>
        </button>
        <!-- Router view here -->
        <!-- <button class="primary green" @click="add">Click to log</button> -->
    </q-layout>
</template>
<script type="text/javascript">
import Database from 'settings/database'
import {
    STATIC_URL
} from 'settings/settings'
import Router from 'root_dir/router'
import AddFinance from 'components/finance-performance/AddNew'
export default {
    data: function() {
        return {
            fiper_root_type: {
                outcome: {
                    text: 'Outcome',
                },
                income: {
                    text: 'Income',
                },
                debts_and_loans: {
                    text: 'Debs and Loans',
                },
            },
            tempo_fiper_data: {
                data: '',
                instance: ''
            },
            fiper_data: {

            }
        }
    },
    mounted: function() {
        console.log('STATIC_URL is ' + STATIC_URL)
            // this.$set('text', this.$parent.global_text)
        var that = this
        that.fetch_fiper_data()
    },
    methods: {
        get_fiper_date: function(fiper) {
            // console.log(fiper)
            var date = new Date(fiper.fiper_date)
            return date.toDateString()
        },
        removeFiper: function(fiper, index, fiper_key) {
            var that = this
            console.log(index)
            var new_data = that.fiper_data[fiper_key].splice(index,1)
            console.log(new_data)
            that.$set(that.fiper_data, fiper_key, that.fiper_data[fiper_key])
            console.log()
            Database.get("fiper").then(function(doc_fiper) {
                console.log(that.fiper_data)
                    // that.$set(that, 'fiper_data', fiper.data)
                console.log(doc_fiper.data)
                doc_fiper.data = that.fiper_data;
                console.log(doc_fiper.data)

                // console.log(doc)
                return Database.put(doc_fiper).then(function(res) {
                    console.log('Delete ' + fiper.fiper_name + ' successfully')
                    that.fetch_fiper_data()
                })
            }).catch(function(err) {
                console.log(err)
                if (err.name === 'not_found') {
                    console.log("not found, must be initialized")
                } else { // hm, some other error
                    throw err
                }
            })
        },
        get_fiper_type_img: function(fiper) {
            return STATIC_URL + '/category/' + fiper.fiper_root_type + '_' + fiper.fiper_type + '.png'
        },
        fetch_fiper_data: function() {
            var that = this
            Database.get("fiper").then(function(fiper) {
                console.log(fiper.data)
                that.$set(that, 'fiper_data', fiper.data)
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
        setFiperData: function(data) {
            var that = this
                // console.log(data)
            try {
                that.$set(that.tempo_fiper_data, 'data', data.data)
                that.$set(that.tempo_fiper_data, 'instance', data.instance)
            } catch (err) {
                console.log(err)
            }
        },
        submitFiperData: function(data) {
            var that = this
            try {
                that.tempo_fiper_data.instance.$emit('reset_fiper_data') // Reset data first
                that.addNewFiper() // Add new one
            } catch (err) {
                console.log(err)
            }
            that.closeFiperModal()
            console.log(that.tempo_fiper_data.data)

        },
        closeFiperModal: function() {
            var that = this
            try {
                that.tempo_fiper_data.instance.$emit('reset_fiper_data') // Reset data first
            } catch (err) {
                console.log(err)
            }
            that.$refs.fiperModal.close()

        },
        addNewFiper: function() {
            var that = this
                // Setup fiper for the first time
            var data = that.tempo_fiper_data.data
            if (data != null && typeof data == typeof {}) {
                Database.get("fiper").then(function(fiper) {
                    console.log(data)
                    fiper.data[data.fiper_root_type].push(data)
                    return Database.put(fiper).then(function(new_fiper) {
                            console.log('update ' + new_fiper.id + ' successfully')
                            console.log(new_fiper)

                            that.fetch_fiper_data() // Fetching again

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
            }
        },
    },
    components: {
        AddFinance
    }
}
</script>
<style type="text/css">
</style>
