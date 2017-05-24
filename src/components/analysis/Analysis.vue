<template>
    <div>This is analysis page</div>
</template>
<script>
import Bus from 'settings/event-bus'
import moment from 'moment'
export default {
    data: function() {
        return {
            date: {}
        }
    },
    mounted: function() {
        var that = this
        that.set_date()
    },
    methods: {
        set_date: function() {
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
                page_title: 'Finance Performance',
                page_subtitle: typeof that.date.current !== 'undefined' ? 'This Month' : that.date.month + '/' + that.date.year
            })
            console.log(that.date)
        },
    },

}
</script>
<style>
</style>
