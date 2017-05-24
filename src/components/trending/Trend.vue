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
            fiper_data: {}
        }
    },
    watch: {
        'fiper_data': {
            handler: function(oldVal, newVal) {
                var that = this
                that.fillData()
                    // console.log(that.datacollection)
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
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
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
            console.log(year)
                // console.log(that.fiper_data['"' + year + '"'])
            if (typeof that.fiper_data['"' + year + '"'] == 'undefined') {
                var d = {}
                that.$set(that.fiper_data, year, d)
            }
            // var year_instance = that.fiper_data['"' + year + '"']
            // console.log(year_instance)
            for (var i = 1; i < 13; i++) {

                var date_data = {
                        year: year,
                        month: i
                    }
                    // Init if year instance does not exist
                that.fetch_fiper_data(date_data)

                // var year = 
            }
            console.log(that.fiper_data)
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
        fetch_fiper_data: function(date = null) {
            var that = this
            var fiper_data = {}
            var fiper_empty_status = []
            Database.get("fiper").then(function(fiper) {
                // console.log(fiper.data)
                for (var key in fiper.data) {
                    var data = fiper.data[key].filter(function(elem) {
                        var elem_date = new Date(elem.fiper_date)
                        return date.month == elem_date.getMonth() + 1 && date.year == elem_date.getFullYear()
                    })
                    fiper_data[key] = data
                }
                // console.log(fiper_data)
                var month_data = {
                    data: that.get_total_performance(fiper_data),
                    month_name: getDateText(date.month)
                }
                that.$set(that.fiper_data[date.year], 'month-' + date.month, month_data)
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
