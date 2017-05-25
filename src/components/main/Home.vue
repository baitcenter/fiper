<template>
    <div class="layout-view">
        <!-- Modal add -->
        <q-modal ref="fiperModal" class="maximized" :content-css="{padding: '50px'}">
            <q-layout>
                <div slot="header" class="toolbar green">
                    <button @click="closeFiperModal">
                        <i>keyboard_arrow_left</i>
                    </button>
                    <q-toolbar-title :padding="1">
                        {{ tempo_fiper_data.fiper_uid != null ? 'Update "' + tempo_fiper_data.data.fiper_name + '"' : 'Create new Fiper' }}
                    </q-toolbar-title>
                </div>
                <div class="layout-view">
                    <div class="layout-padding">
                        <fiper v-on:set_tempo_fiper_data="setTempoFiperData" v-on:starting-stage="startingFiper"></fiper>
                        <button class="primary outline green" @click="submitFiperData">Set</button>
                        <button class="secondary green" @click="closeFiperModal">Cancel</button>
                    </div>
                </div>
            </q-layout>
        </q-modal>
        <div v-if="!empty_fiper" class="performance-wrapper full-width auto">
            <div class="row items-center">
                <div class="text-left pointing-left label sm-width-1of3 auto bg-green text-white">
                    <h6>Overview</h6>
                </div>
                <div class="sm-width-2of3 auto text-right performance-trending-btn">
                    <router-link tag="button" class="primary outline" :to="{ path: '/analysis/' + date.year + '/' + date.month, exact: true  }"><i>developer_board</i> Analyse</router-link>
                </div>
            </div>
            <table class="q-table highlight loose full-width auto text-left">
                <tbody>
                    <tr>
                        <td>Income</td>
                        <td class="text-right">{{ get_inflow_performance(fiper_data) }} USD</td>
                    </tr>
                    <tr>
                        <td>Outcome</td>
                        <td class="text-right">{{ get_outflow_performance(fiper_data) }} USD</td>
                    </tr>
                    <tr>
                        <td>
                            <router-link class="green" :to="{ path: '/trending/' + date.year, exact: true  }">See Trending</router-link>
                        </td>
                        <td class="text-right">{{ get_total_performance(fiper_data) }} USD</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="date-fiper-wrapper" v-for="day in Object.keys(render_fiper_data).reverse()" :id="'day-' + day">
            <div class="row items-center justify-stretch">
                <div class="sm-width-2of3">
                    <div class="text-left pointing-left label bg-green text-white">
                        <h6>{{ get_date_string(day) }}</h6>
                    </div>
                </div>
                <div :id="'day-' + day + '-performance'" class="day-performance text-right sm-width-1of3">
                    <span class="label bg-blue-grey text-white">
                <span>{{ get_total_performance(render_fiper_data[day]) > 0 ? '+' + get_total_performance(render_fiper_data[day]): get_total_performance(render_fiper_data[day]) }} USD</span>
                    </span>
                </div>
            </div>
            <div v-for="(fiper_value,fiper_key) in render_fiper_data[day]" class="full-width fiper-wrapper" :id="'fiper-' + fiper_key">
                <div v-for="(value,index) in fiper_value" class="card flex items-center wrap justify-start">
                    <div class="row auto full-width items-center justify-end">
                        <div class="card-title auto row">
                            <h3>{{ value.fiper_amount }} </h3> USD
                        </div>
                        <div class="fiper-action float-right row">
                            <div class="circular small fiper-logo-wrapper">
                                <img class="button fiper-logo small" :src="get_fiper_type_img(value)">
                            </div>
                            <button class="green circular small outline" @click="openEditFiper(value.fiper_uid,fiper_key)"><i class="material-icons">edit</i></button>
                            <button class="green circular small" @click="removeFiperPrompt(value.fiper_uid,fiper_key)"><i class="material-icons">delete</i></button>
                        </div>
                    </div>
                    <div class="full-width auto">
                        <div class="row full-width auto wrap">
                            <div class="row fiper-data self-stretch full-width auto">
                                <div class="card-content wrap auto">
                                    <h6> {{ value.fiper_name }}</h6>
                                    <div>{{ value.fiper_des }}</div>
                                </div>
                            </div>
                            <div class="row full-width auto items-center fiper-extra-info">
                                <div class="float-left auto">{{ value.fiper_type_name }}</div>
                                <div class="fiper-root-type chip label bg-green text-white float-right">
                                    <!-- {{ value.fiper_type_name }}  -->
                                    {{ fiper_root_type[fiper_key].text }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="empty_fiper" class="row wrap items-center text-center justify-center full-height">
            <h6 class="text-center result-not-found">Touch the <i>note_add</i> icon to create your first Fiper :)</h6>
        </div>
        <div id="scroll" v-scroll="detectScroll"></div>
        <!-- <draggable @start="drag=true" @end="drag=false"> -->
        <button id="add-fiper" class="primary green circular fixed-bottom-right btn-primary big" @click="$refs.fiperModal.open()">
            <i>note_add</i>
        </button>
    </div>
    <!-- </draggable> -->
    <!-- Router view here -->
    <!-- <button class="primary green" @click="add">Click to log</button> -->
</template>
<script type="text/javascript">
import Database from 'settings/database'
import {
    STATIC_URL
} from 'settings/settings'
import Router from 'root_dir/router'
import Fiper from 'components/finance-performance/Fiper'
import $ from "jquery"
import {
    Dialog,
    Toast
} from 'quasar'
import Success from 'components/alert/Success'
import Bus from 'settings/event-bus'
import moment from 'moment'
import {
    Utils,
    LocalStorage
} from 'quasar'

// TODO: use drag and drop
// TODO: use Bus instead

export default {

    data: function() {
        return {
            date: {
                month: '',
                year: ''
            },
            empty_fiper: true,
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
                data: null,
                instance: null,
                fiper_uid: null,
                fiper_key: null
            },
            fiper_data: {

            },
            render_fiper_data: {

            }
        }
    },
    watch: {
        '$route': {
            handler(to, from) {
                var that = this
                console.log('start date')
                that.set_date()
            }
        },
        'date': {
            handler(oldVal, newVal) {
                var that = this
                that.fetch_fiper_data()
            },
            deep: true
        }
    },
    beforeDestroy: function() {
        Bus.$emit('destroy_fiper_component')
        Bus.$off('change_date')

    },
    created: function() {
        var that = this

        console.log('STATIC_URL is ' + STATIC_URL)
            // this.$set('text', this.$parent.global_text)
        Bus.$emit('receive_fiper_component', that)
        Bus.$emit('receive_child_info', {
            page_title: 'Finance Performance',
            page_subtitle: 'This month'
        })
        that.set_date()

    },
    mounted: function() {
        var that = this
        Bus.$on('change_date', function() {
            console.log('date changed')
            that.set_date()
        })
    },
    computed: {

    },
    methods: {
        get_total_performance: function(fiper_dict) {
            var that = this
            return that.get_inflow_performance(fiper_dict) - that.get_outflow_performance(fiper_dict)
        },
        get_inflow_performance: function(fiper_dict) {
            var that = this
            try {
                var inflow = fiper_dict.income.reduce(function(prevValue, elem) {
                    return prevValue + elem.fiper_amount
                }, 0)

            } catch (err) {
                var inflow = 0
            }
            try {

                var inflow_from_debts = fiper_dict.debts_and_loans.reduce(function(prevValue, elem) {
                    return prevValue + (elem.fiper_type == 'debt' ? elem.fiper_amount : 0)
                }, 0)
            } catch (err) {
                var inflow_from_debts = 0
            }
            return inflow + inflow_from_debts

        },
        get_outflow_performance: function(fiper_dict) {
            var that = this
            try {
                var outflow = fiper_dict.outcome.reduce(function(prevValue, elem) {
                    return prevValue + elem.fiper_amount
                }, 0)

            } catch (err) {
                var outflow = 0
            }
            try {

                var outflow_from_loan = fiper_dict.debts_and_loans.reduce(function(prevValue, elem) {
                    return prevValue + (elem.fiper_type == 'loan' ? elem.fiper_amount : 0)
                }, 0)
            } catch (err) {
                var outflow_from_loan = 0
            }
            return outflow + outflow_from_loan

        },
        get_date_string: function(day) {
            var that = this
            var date = new Date(that.date.year, that.date.month - 1, day)
            return date.toDateString()
        },
        get_performance: function(fiper_dict) {
            var that = this
            var data = {
                income: that.get_inflow_performance(fiper_dict),
                outcome: that.get_outflow_performance(fiper_dict),
                total: that.get_total_performance(fiper_dict)
            }
            return data
        },
        set_date: function() {
            var that = this
            var data = {}
            var _data = LocalStorage.get.item('current_date')
            if (_data != null) {
                console.log('current_date is not null')
                data.month = _data.month
                data.year = _data.year
            } else {
                var _date = moment().format()
                var date = new Date(_date)
                data = {
                    month: date.getMonth() + 1,
                    year: date.getFullYear(),
                }
            }
            that.$set(that, 'date', data)

            Bus.$emit('receive_child_info', {
                page_title: 'Finance Performance',
                page_subtitle: that.date.month + '/' + that.date.year
            })
            console.log(that.date)
        },
        set_date_v2: function() {
            var that = this
                // react to route changes...
            console.log('month: ' + that.$route.params.month)
            console.log('year: ' + that.$route.params.year)
            console.log('day: ' + that.$route.params.day)

            if (typeof that.$route.params.month !== 'undefined' && typeof that.$route.params.year !== 'undefined') {
                // console.log('1st')
                // Check conditions
                if ((that.$route.params.month < 1 || that.$route.params.month > 12) || (that.$route.params.year < 0)) {
                    Bus.$emit('receive_child_info', {
                        page_title: 'Finance Performance',
                        page_subtitle: 'Invalid month or year'
                    })
                    return false
                }
                var data = {
                        year: that.$route.params.year,
                        month: that.$route.params.month
                    }
                    // console.log(data)
                that.$set(that, 'date', data)
            } else {
                // console.log('here')
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
            Bus.$emit('receive_child_info', {
                    page_title: 'Finance Performance',
                    page_subtitle: that.date.month + '/' + that.date.year
                })
                // console.log(that.date)
        },
        sort_fiper_data_with_date: function() {
            var that = this
            var data_container = []
            var origin_data = Object.assign({}, that.fiper_data)
            var render_data = {}
                // This is for process data
            for (var key in origin_data) {
                // console.log(origin_data[key].reverse())
                origin_data[key].reverse().map(function(elem) {
                    var elem_date = new Date(elem.fiper_date)
                    var date_key = elem_date.getDate()
                    if (typeof data_container[date_key] === 'undefined') {
                        data_container.push(date_key)
                    }
                    if (typeof render_data[date_key] === 'undefined') {
                        render_data[date_key] = {}
                    }
                    if (typeof render_data[date_key][key] === 'undefined') {
                        render_data[date_key][key] = []
                    }
                    render_data[date_key][key].push(elem)
                })
            }
            // This is for process performance
            console.log(render_data)
                // Sort from lastest to oldest
                // const exact_render_data = {}
                // Object.keys(render_data).sort().reverse().forEach(function(key) {
                //     exact_render_data[key] = render_data[key];
                //     console.log(key)
                // });
                // console.log(exact_render_data)
            return render_data
        },
        startingFiper: function(instance) {
            var that = this
                // This methods is to receive fiper instance, comfortable to communicate
            that.$set(that.tempo_fiper_data, 'instance', instance)
            console.log('binding instance successfully')
        },
        openEditFiper: function(fiper_uid, fiper_key) {
            var that = this
            var data = {
                fiper_key: fiper_key,
                fiper_uid: fiper_uid
            }
            that.$set(that.tempo_fiper_data, 'fiper_uid', fiper_uid) // Set tempo data
            that.$set(that.tempo_fiper_data, 'fiper_key', fiper_key) // Set tempo data
            that.tempo_fiper_data.instance.$emit('fetch_single_fiper_data', data)
            that.$refs.fiperModal.open()
        },
        detectScroll: function(elem) {
            // var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            // var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            // console.log(width)
            var screen_height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            var flag_height = $('#scroll').offset().top
            var add_fiper_btn = $('#add-fiper')
                // console.log(flag_height)
                // console.log(screen_height)
            if (Math.abs(flag_height - screen_height) < 10) {
                // console.log(Math.abs(flag_height - screen_height))
                // console.log('triggred when scroll')
                $('#add-fiper').addClass('bottom-scrolled')
            } else {
                $('#add-fiper').removeClass('bottom-scrolled')
            }
            // console.log(elem)
        },
        get_fiper_date: function(fiper) {
            // console.log(fiper)
            var date = new Date(fiper.fiper_date)
            return date.toDateString()
        },
        removeFiperPrompt: function(fiper_uid, fiper_key) {
            var that = this
            Dialog.create({
                title: 'Are you sure?',
                message: 'We cannot recover the deleted Fiper for you',
                buttons: [{
                    label: 'Cancel',
                    classes: 'green ',
                    handler() {

                    }
                }, {
                    label: 'Yes',
                    classes: 'green outline',
                    handler() {
                        that.removeFiper(fiper_uid, fiper_key)
                    }
                }]
            })
        },
        removeFiper: function(fiper_uid, fiper_key) {
            var that = this
                // https://stackoverflow.com/questions/8668174/indexof-method-in-an-object-array

            Database.get("fiper").then(function(doc_fiper) {
                console.log(that.fiper_data)
                var index = doc_fiper.data[fiper_key].map(function(elem, index, inside_array) {
                    return elem.fiper_uid;
                }).indexOf(fiper_uid);

                console.log(index)
                console.log(fiper_key)
                doc_fiper.data[fiper_key].splice(index, 1)
                that.$set(that.fiper_data, fiper_key, doc_fiper.data[fiper_key])
                    // console.log(doc)
                return Database.put(doc_fiper).then(function(res) {
                    console.log('Delete fiper with id (' + fiper_key + ', ' + index + ') successfully')
                    that.fetch_fiper_data()
                    Toast.create.positive('Delete successfully')
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
        fetch_fiper_data: function(date = null) {
            var that = this
            var fiper_data = {}
            var fiper_empty_status = []
            Database.get("fiper").then(function(fiper) {
                console.log(fiper.data)
                for (var key in fiper.data) {
                    var data = fiper.data[key].filter(function(elem) {
                        var elem_date = new Date(elem.fiper_date)
                        if (date == null) return that.date.month == elem_date.getMonth() + 1 && that.date.year == elem_date.getFullYear()
                        else {
                            return date.month == elem_date.getMonth() + 1 && date.year == elem_date.getFullYear()
                        }
                    })
                    fiper_data[key] = data
                    if (fiper_data[key].length > 0) {
                        fiper_empty_status.push(false)
                    } else {
                        fiper_empty_status.push(true)
                    }
                    // console.log(doc)
                }
                console.log(fiper_data)
                that.$set(that, 'fiper_data', fiper_data)
                if (fiper_empty_status.indexOf(false) != -1) {
                    that.$set(that, 'empty_fiper', false)
                } else {
                    that.$set(that, 'empty_fiper', true)
                }

                that.$set(that, 'render_fiper_data', that.sort_fiper_data_with_date())

            }).catch(function(err) {
                console.log(err)
                if (err.name === 'not_found') {
                    console.log("not found, must be initialized")
                } else { // hm, some other error
                    throw err
                }
            })
        },
        setTempoFiperData: function(data) {
            var that = this
                // console.log(data)
            try {
                that.$set(that.tempo_fiper_data, 'data', data)
            } catch (err) {
                console.log(err)
            }
        },
        resetTempoFiperData: function() {
            var that = this

            var new_data = {
                data: null,
                instance: that.tempo_fiper_data.instance,
                index: null,
                fiper_key: null
            }
            that.$set(that, 'tempo_fiper_data', new_data)
        },
        submitFiperData: function() {
            var that = this
            var data = Object.assign({}, that.tempo_fiper_data)
            console.log(data.data.fiper_type)
            if (data.data.fiper_type == '---' || data.data.fiper_type == null) {
                Toast.create.negative("You might want to click on the \"Select now\" to choose your category.")
                return false
            }
            try {
                that.tempo_fiper_data.instance.$emit('reset_fiper_data') // Reset data first


                if (data.fiper_uid != null) {
                    that.updateFiper(data.fiper_uid, data.data)
                } else {
                    that.addNewFiper(data.data)
                }

                that.resetTempoFiperData() // reset tempo fiper data
            } catch (err) {
                console.log(err)
            }
            that.closeFiperModal()
            $('#add-fiper').removeClass('bottom-scrolled')
            console.log(that.tempo_fiper_data.data)
        },
        closeFiperModal: function() {
            var that = this

            try {
                that.tempo_fiper_data.instance.$emit('reset_fiper_data') // Reset data first
                that.resetTempoFiperData()
            } catch (err) {
                console.log(err)
            }
            that.$refs.fiperModal.close()
        },
        updateFiper: function(fiper_uid, data) {
            var that = this
                // var data = that.tempo_fiper_data.data
            if (data != null && typeof data == typeof {}) {
                Database.get("fiper").then(function(fiper) {
                    console.log(fiper.data)
                        // https://stackoverflow.com/questions/8668174/indexof-method-in-an-object-array
                    var index = fiper.data[data.fiper_root_type].map(function(elem, index, inside_array) {
                        return elem.fiper_uid;
                    }).indexOf(fiper_uid);
                    console.log('index is ' + index)
                    console.log(fiper.data[data.fiper_root_type][index])
                    fiper.data[data.fiper_root_type][index] = data
                    console.log(fiper.data[data.fiper_root_type][index])

                    return Database.put(fiper).then(function(updated_fiper) {
                            console.log('update ' + updated_fiper.id + ' successfully')
                            console.log(updated_fiper)
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
        addNewFiper: function(data) {
            var that = this
                // Setup fiper for the first time
                // var data = that.tempo_fiper_data.data
            if (data != null && typeof data == typeof {}) {
                Database.get("fiper").then(function(fiper) {
                    data.fiper_uid = Utils.uid()
                    console.log(fiper.data)
                        // console.log(data.fiper_root_type)
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
        Fiper,
        Success
    }
}
</script>
<style type="text/css">
</style>
