<template>
    <div class="chart-wrapper">
        <h5>Trending For Year 2017</h5>
        <chart :chart-data="datacollection"></chart>
        <button class="green circular" @click="fetch_trend_data(2015)">2015</button>
    </div>
</template>
<script type="text/javascript">
import Bus from 'settings/event-bus'
import Chart from './Chart'
import {
    Database
} from 'settings/settings'
import {
    getDateText
} from 'settings/utils'
import moment from 'moment'

export default {
    data: function() {
        return {
            datacollection: {
                labels: [],
                datasets: []
            },
            fiper_data: {},
            tempo_data: {}
        }
    },
    watch: {
        'fiper_data': {
            handler: function(oldVal, newVal) {
                var that = this
                that.fillData()
                console.log('triggered fillData')
            },
            deep: true
        },
        'tempo_data': {
            handler: function(oldVal, newVal) {
                var that = this
                that.$set(that.fiper_data, that.tempo_data.year, that.tempo_data.data)
            },
            deep: true
        }
    },
    mounted: function() {
        var that = this
        Bus.$emit('receive_child_info', {
                page_title: 'Trending',
                page_subtitle: ''
            })
            // that.fillData() 
            // that.fetch_trend_data(2015)
        that.fetch_trend_data()

    },
    methods: {
        getCurrentYear: function() {
            var _date = new Date(moment().format())
            return _date.getFullYear()
        },
        getMonthLabels: function() {
            var that = this
            var labels = []
            for (var i = 1; i < 13; i++) {
                labels.push(getDateText(i))
            }
            var data = {
                labels: labels,
                datasets: []
            }
            return labels
        },
        fillData: function() {
            var that = this
                // console.log('here')
                // Lolz, must init a full dict like this
            var datacollection = {
                    labels: that.getMonthLabels(),
                    datasets: that.datacollection.datasets
                }
                // This did trick to reactivity chart's data
            var chart_data = that.fiper_data

            for (var key in chart_data) {
                // Iterate each year first
                var color_theme = that.getCurrentYear() == key ? '#4caf50' : '#027be3'
                var dataset = {
                    label: key,
                    data: [],
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: color_theme, // Current year is main theme's color
                    borderColor: color_theme,
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: color_theme,
                    pointBackgroundColor: color_theme,
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: color_theme,
                    pointHoverBorderColor: color_theme,
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    spanGaps: false,
                }

                // Now to push 12 month values into the chart
                for (var month_key in chart_data[key]) {
                    dataset.data.push(chart_data[key][month_key].data)
                }

                var index = Object.keys(that.fiper_data).indexOf(key) // This is equal to number of year - 1
                    // console.log(dataset)
                datacollection.datasets[index] = dataset

            }
            that.$set(that, 'datacollection', datacollection)

        },
        fetch_trend_data: function(year = null) {
            var that = this
            if (year == null) {
                var _current_date = moment().format()
                var current_date = new Date(_current_date)
                year = current_date.getFullYear()
            }
            // console.log(year)
                // console.log(that.fiper_data['"' + year + '"'])
            that.fetch_fiper_data(year)
                // Need watcher now

            // console.log(that.tempo_data)

            // if (typeof that.fiper_data['"' + year + '"'] == 'undefined') {
            //     that.$set(that.fiper_data, year, that.tempo_data)
            // }

            // console.log(that.fiper_data)
            // that.fillData()

        },
        get_total_performance: function(month_fiper_data) {
            var that = this
            return that.get_inflow_performance(month_fiper_data) - that.get_outflow_performance(month_fiper_data)
        },
        get_inflow_performance: function(month_fiper_data) {
            var that = this
            try {
                var inflow = month_fiper_data.income.reduce(function(prevValue, elem) {
                    return prevValue + elem.fiper_amount
                }, 0)
                var inflow_from_debts = month_fiper_data.debts_and_loans.reduce(function(prevValue, elem) {
                    return prevValue + (elem.fiper_type == 'debt' ? elem.fiper_amount : 0)
                }, 0)
                return inflow + inflow_from_debts
            } catch (err) {
                return 0
            }

        },
        get_outflow_performance: function(month_fiper_data) {
            var that = this
            try {
                var outflow = month_fiper_data.outcome.reduce(function(prevValue, elem) {
                    return prevValue + elem.fiper_amount
                }, 0)
                var outflow_from_loan = month_fiper_data.debts_and_loans.reduce(function(prevValue, elem) {
                    return prevValue + (elem.fiper_type == 'loan' ? elem.fiper_amount : 0)
                }, 0)
                return outflow + outflow_from_loan
            } catch (err) {
                return 0
            }
        },
        fetch_fiper_data: function(year) {
            var that = this
            var year_data = {
                year: year,
                data: {}
            }
            Database.get("fiper").then(function(fiper) {
                // console.log(fiper.data)
                for (var i = 1; i < 13; i++) {
                    var fiper_data = {}

                    for (var key in fiper.data) {
                        var data = fiper.data[key].filter(function(elem) {
                            var elem_date = new Date(elem.fiper_date)
                            return i == elem_date.getMonth() + 1 && year == elem_date.getFullYear()
                        })
                        fiper_data[key] = data
                    }
                    // console.log(fiper_data)
                    var month_data = {
                        data: that.get_total_performance(fiper_data),
                        month_name: getDateText(i)
                    }
                    year_data.data['month-' + i] = month_data
                }
                that.$set(that, 'tempo_data', year_data)
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
    },
    components: {
        Chart
    }
}
</script>
<style type="text/css"></style>
