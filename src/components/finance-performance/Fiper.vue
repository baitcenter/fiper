<template>
    <div class="add-new-fiper-wrapper">
        <!-- <h1>Your performance</h1> -->
        <!-- Single Selection using Radios -->
        {{ $route.params.id }}
        <div class=" full-width flex justify-center">
            <div class="add-new-fiper form-wrapper sm-width-5of5 width-3of5">
                <div class="item two-lines">
                    <i v-if="form.fiper_type == '---'" class="material-icons item-primary">highlight</i>
                    <div class="category-logo material-icons item-primary">
                        <img v-if="form.fiper_type != '---'" v-bind:src="'statics/category/' + form.fiper_root_type + '_' + form.fiper_type + '.png'" alt="">
                    </div>
                    <div class="item-content" @click="openCategorySelect()">
                        <q-select class="full-width green fiper-select-type" disable type="radio" v-model="form.fiper_type" :options="fiper_type"></q-select>
                    </div>
                </div>
                <div class="item two-lines">
                    <i class="material-icons item-primary">monetization_on</i>
                    <div class="item-content">
                        <q-numeric class="full-width green" v-model="form.fiper_amount" :min="0"></q-numeric>
                    </div>
                </div>
                <div class="item two-lines">
                    <i class="material-icons item-primary">account_circle</i>
                    <div class="item-content">
                        <input required class="full-width green" v-model="form.fiper_name" placeholder="Name">
                    </div>
                </div>
                <div class="item two-lines">
                    <i class="material-icons item-primary">edit</i>
                    <div class="item-content">
                        <input required class="full-width green" v-model="form.fiper_des" placeholder="Description">
                    </div>
                </div>
                <div class="item two-lines">
                    <i class="material-icons item-primary">event_note</i>
                    <div class="item-content">
                        <q-datetime class="full-width green" v-model="form.fiper_date" type="date"></q-datetime>
                    </div>
                </div>
                <!-- Only Date -->
            </div>
        </div>
        <!-- Modal to select category -->
        <q-modal ref="categorySelect" class="maximized">
            <q-layout class="green  add-fiper">
                <div slot="header" class="toolbar green">
                    <button @click="closeCategorySelect()">
                        <i>keyboard_arrow_left</i>
                    </button>
                    <q-toolbar-title :padding="1">
                        Go back
                    </q-toolbar-title>
                    <q-search class="primary green" v-model="category_search.keyword" :debounce="200"></q-search>
                </div>
                <q-tabs slot="navigation" ref="tabs" @change="toggleTabs" class="flex primary green justify-center">
                    <q-tab name="debts_and_loans" replace>Debts & Loans</q-tab>
                    <q-tab name="income" replace>Income</q-tab>
                    <q-tab name="outcome" exact replace>Outcome</q-tab>
                </q-tabs>
                <div class="layout-view">
                    <div class="layout-padding">
                        <div class="category-wrapper flex" v-for="(value,key) in fiper_group_render" v-bind:ref="key">
                            <div :id="key" style="display: none" class="row wrap justify-start full-width">
                                <div v-for="(category,index) in value" class="category sm-width-1of2 text-center" @click="selectCategory(key,category.value)">
                                    <img v-bind:src="'statics/category/' + key + '_' + category.value + '.png'" alt="">
                                    <div> {{ category.label }} </div>
                                </div>
                            </div>
                        </div>
                        <h3 v-if="category_search.result_not_found" class="result-not-found">No results for "{{ category_search.keyword }}"</h3>
                    </div>
                </div>
            </q-layout>
        </q-modal>
    </div>
</template>
<script type="text/javascript">
import moment from 'moment'
import Database from 'settings/database'
import $ from "jquery";
import Bus from 'settings/event-bus'
import { LocalStorage } from 'quasar'
export default {
    methods: {
        restoreSearchData: function() {
            var that = this
            var origin_data = Object.assign({}, that.fiper_group)
            that.$set(that, 'fiper_group_render', origin_data)
            that.$set(that.category_search, 'result_not_found', false)
        },
        toggleTabs: function(tab) {
            console.log(tab)
            var that = this
            that.$set(that, 'current_tab', tab)
        },
        openCategorySelect: function() {
            var that = this
            that.$refs.categorySelect.open()
            that.toggleTabs('income')
        },
        closeCategorySelect: function() {
            var that = this
            that.$refs.categorySelect.close()
        },
        selectCategory: function(key, option) {
            var that = this
            that.$set(that.form, 'fiper_type', option)
            that.$set(that.form, 'fiper_root_type', key)
            that.$refs.categorySelect.close()
        },
        searchCategory: function() {
            var that = this
            if (that.category_search.keyword != '') {
                console.log('starting searching with ' + that.category_search.keyword)
                    // First is to restore original data
                that.restoreSearchData()
                    // Now to filter
                for (var key in that.fiper_group_render) {
                    var new_data = that.fiper_group_render[key].filter(function(elem) {
                        if (elem.label.toLowerCase().indexOf(that.category_search.keyword.toLowerCase()) !== -1)
                            return true
                    }).slice()
                    that.$set(that.fiper_group_render, key, new_data)
                }
                console.log(that.current_tab)
                    // Set status
                if (that.fiper_group_render[that.current_tab].length < 1) {
                    that.$set(that.category_search, 'result_not_found', true)
                } else {
                    that.$set(that.category_search, 'result_not_found', false)
                        // that.restoreSearchData()
                }
                console.log(that.fiper_group_render[that.current_tab].length)
                console.log('search done')
            }
        },

        resetFiperData: function() {
            var that = this
            var data = {
                fiper_uid: "",
                fiper_type: "---",
                fiper_date: that.current_date.date_text,
                fiper_name: "",
                fiper_des: "",
                fiper_amount: 0,
                fiper_root_type: '',
                fiper_type_name: ''
            }
            that.$set(that, 'form', data)
                // console.log(that.form)
        },
        get_category_from_value: function(value) {
            var that = this
            return that.fiper_type.filter(function(elem) {
                return elem.value == value
            })
        },
        set_date: function() {
            var that = this
            var data = {}
            var _data = LocalStorage.get.item('current_date')
            if (_data != null) {
                console.log('current_date is not null')
                data = _data
            } else {
                var _date = moment().format()
                var date = new Date(_date)
                data = {
                    month: date.getMonth() + 1,
                    year: date.getFullYear(),
                    day: date.getDate(),
                    date_text: date.toISOString()
                }
            }
            that.$set(that, 'current_date', data)


            console.log(that.date)
        },
    },
    watch: {
        'current_tab': {
            handler: function(newVal, oldVal) {
                var that = this
                console.log('triggered current_tab watcher')
                $('#income').hide()
                $('#outcome').hide()
                $('#debts_and_loans').hide()
                $('#' + newVal).show()
                that.$refs.tabs.setActiveTab(newVal)
                that.searchCategory()
            }
        },
        'category_search.keyword': {
            handler: function(newVal, oldVal) {
                var that = this
                if (newVal != '') that.searchCategory()
                else that.restoreSearchData()

            }
        },
        'form': {
            handler: function(newVal, oldVal) {
                var that = this
                var fiper_type_name = that.get_category_from_value(that.form.fiper_type)[0].label
                console.log(fiper_type_name)
                newVal.fiper_type_name = fiper_type_name
                that.$emit('set_tempo_fiper_data', newVal)
            },
            deep: true
        },
        'current_date': {
            handler: function(newVal, oldVal) {
                var that = this
                that.$set(that.form, 'fiper_date', that.current_date.date_text)
            },
            deep: true
        }
    },
    data: function() {
        return {
            form: {
                fiper_uid: "",
                fiper_type: "---",
                fiper_date: moment().format(),
                fiper_name: "",
                fiper_des: "",
                fiper_amount: 0,
                fiper_root_type: '',
                fiper_type_name: ''
            },
            fiper_type: [{
                label: 'Select now',
                value: '---'
            }],
            fiper_group_render: {},
            fiper_group: {},
            category_search: {
                keyword: '',
                result_not_found: {

                }
            },
            current_tab: '',
            current_date: ''
        }
    },
    beforeDestroy: function() {
        Bus.$off('fiper_init_date')
    },
    mounted: function() {

        var that = this

        console.log(that)
        that.$emit('starting-stage', that)
        that.$emit('set_tempo_fiper_data', that.form)
        Bus.$on('change_date', function() {
            console.log('date changed')
            that.set_date()
        })
        that.$on('fetch_single_fiper_data', function(data) {
            Database.get('fiper').then(function(fiper) {
                console.log(data)
                var index = fiper.data[data.fiper_key].map(function(elem, index, inside_array) {
                    return elem.fiper_uid;
                }).indexOf(data.fiper_uid);
                console.log(fiper.data)
                var fiper_data = fiper.data[data.fiper_key][index]
                that.$set(that, 'form', fiper_data)
                console.log('fetching fiper data successfully')
            }).catch(function(err) {
                console.log(err)
            })
        })

        that.$on('reset_fiper_data', function() {
                console.log('triggered reset_fiper_data')
                that.restoreSearchData()
                that.resetFiperData()
            })
            // Fetch category
        Database.get('fiper_category').then(function(res) {
                // console.log(res)
                var data = Object.assign({}, res)
                that.$set(that, 'fiper_group_render', res.data)
                that.$set(that, 'fiper_group', data.data)

                // console.log(that.fiper_group)
                // console.log(that.fiper_group)
                for (var key in that.fiper_group) {
                    // console.log(key)
                    var data = that.fiper_group[key].slice()
                        // console.log(data)
                    var _fiper_type = that.fiper_type.slice()
                        // console.log(_fiper_type)
                    that.$set(that, 'fiper_type', _fiper_type.concat(data))

                }
                that.restoreSearchData()

            }).catch(function(err) {
                console.log(err)
            })
            // console.log(that.fiper_type)
    },
}
</script>
<style type="text/css"></style>
