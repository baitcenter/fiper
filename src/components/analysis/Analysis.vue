<template>
    <div class="analysis-wrapper">
        <!-- <div class="text-left pointing-left label bg-green text-white outline">
            <h6>Analysis For {{ display_date }}</h6>
        </div> -->
        <div v-if="display_options.enable_income" class="chart-wrapper ">
            <div class="text-left">
                <h6>INCOME</h6>
            </div>
            <chart :chart-data="income_chart_data"></chart>
            <h6 class="text-center">Analysis for {{ display_date }} </h6>
        </div>
        <div v-if="display_options.enable_outcome" class="chart-wrapper">
            <div class="text-left ">
                <h6>OUTCOME</h6>
            </div>
            <chart :chart-data="outcome_chart_data"></chart>
            <h6 class="text-center">Analysis for {{ display_date }} </h6>
        </div>
        <div class="text-center" v-if="!display_options.enable_outcome && !display_options.enable_income">
            <h3>Empty Data</h3>
        </div>
    </div>
</template>
<script>
import Bus from 'settings/event-bus'
import moment from 'moment'
import Chart from './Chart'
import {
    Database
} from 'settings/settings'
import {
    LocalStorage
} from 'quasar'
export default {
    data: function() {
        return {
            date: {},
            fiper_data: {},
            income_chart_data: {},
            outcome_chart_data: {},
            fiper_category: {},
            display_options: {
                enable_income: false,
                enable_outcome: false
            }
        }
    },
    watch: {
        'fiper_data': {
            handler: function(newVal, oldVal) {
                var that = this
                console.log('fiper_data changed')
                that.fillData()
                if (newVal['income'].length > 0) {
                    that.$set(that.display_options, 'enable_income', true)
                } else {
                    that.$set(that.display_options, 'enable_income', false)
                }
                if (newVal['outcome'].length > 0) {
                    that.$set(that.display_options, 'enable_outcome', true)
                } else {
                    that.$set(that.display_options, 'enable_outcome', false)
                }
            },
            deep: true
        },
        'fiper_category': {
            handler: function(newVal, oldVal) {
                var that = this
                    // console.log('fiper_category')
                    // console.log(that.fiper_category)
                that.fetch_fiper_data()
            },
            deep: true
        },
        '$route': {
            handler: function(to, from) {
                var that = this
                that.set_date()
            }
        },
        'date': {
            handler: function(newVal, oldVal) {
                var that = this
                that.fetch_fiper_data()

            },
            deep: true
        }
    },
    mounted: function() {
        var that = this
        that.set_date()
        that.fetch_category_data()
        Bus.$on('change_date', function() {
            console.log('date changed')
                that.set_date()
            })
            // Bus.$on()
    },
    beforeDestroy: function() {
        Bus.$off('change_date')
    },
    computed: {
        display_date: function() {
            var that = this
            return that.date.month + '/' + that.date.year
        }
    },
    methods: {
        fetch_category_data: function() {
            var that = this
            Database.get('fiper_category').then(function(res) {
                // console.log(res.data)
                var data = Object.assign({}, res)
                    // console.log(res.data)
                that.$set(that, 'fiper_category', res.data)
            }).catch(function(err) {
                console.log(err)
            })
        },
        get_category_by_slug: function(root_type, slug) {
            var that = this
            return that.fiper_category[root_type].filter(function(elem) {
                return elem.value == slug
            })
        },
        fillData: function() {
            var that = this
            var original_data = that.fiper_data
            for (var key in original_data) {
                if (original_data[key].length == 0) {
                    continue
                }

                var datacollection = {
                    labels: [],
                    datasets: []
                }
                var datacontainer = []
                var color_theme = that.current_year == key ? '#4caf50' : '#027be3'
                var dataset = {
                        data: [],
                        backgroundColor: [], // Current year is main theme's color
                    }
                    // Get type to process data
                original_data[key].map(function(elem) {
                        if (datacontainer.indexOf(elem.fiper_type) == -1) {
                            datacontainer.push(elem.fiper_type)
                        }
                    })
                    // console.log(datacontainer)
                    // Process value
                datacontainer.map(function(fiper_type) {
                    var data_list = original_data[key].filter(function(elem) {
                        return elem.fiper_type == fiper_type
                    })
                    var performance = data_list.reduce(function(prevValue, elem) {
                        return prevValue + elem.fiper_amount
                    }, 0)
                    dataset.data.push(performance)
                    var category = that.get_category_by_slug(key, fiper_type)
                    if (category.length > 0) {
                        dataset.backgroundColor.push(category[0].color)
                        console.log(category[0].color)
                    } else {
                        dataset.backgroundColor.push('#4caf50')
                    }
                    datacollection.labels.push(category[0].label + ' (' + performance + ' USD' + ')')

                })
                datacollection.datasets.push(dataset)
                that.$set(that, key + '_chart_data', datacollection)
            }
            // console.log(datacollection)
        },
        fetch_fiper_data: function(year) {
            var that = this
            var date = that.date
            Database.get("fiper").then(function(fiper) {
                // console.log(fiper.data)
                var fiper_data = {}

                for (var key in fiper.data) {
                    var data = fiper.data[key].filter(function(elem) {
                        var elem_date = new Date(elem.fiper_date)
                        return date.month == elem_date.getMonth() + 1 && date.year == elem_date.getFullYear()
                    })
                    fiper_data[key] = data
                }
                console.log('fetch_fiper_data')

                that.$set(that, 'fiper_data', fiper_data)
                    // return year_data
                    // console.log(that.fiper_data)
            }).catch(function(err) {
                console.log(err)
                if (err.name === 'not_found') {
                    console.log("not found, must be initialized")
                } else { // hm, some other error
                    throw err
                }
            })
        },
        set_date: function() {
            var that = this
            var data = {}
            var _data = LocalStorage.get.item('current_date')
            if (LocalStorage.get.item('current_date') != null) {
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
                page_title: 'Analysis',
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
                        page_title: 'Analysis',
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
            Bus.$emit('receive_child_info', {
                page_title: 'Analysis',
                page_subtitle: that.date.month + '/' + that.date.year
            })
            console.log(that.date)
        },
    },
    components: {
        Chart
    }

}
</script>
<style>
</style>
