// CommitChart.js
import { Doughnut, Pie, mixins } from 'vue-chartjs'
import Bus from 'settings/event-bus'
export default Pie.extend({

    mixins: [mixins.reactiveProp],
    props: ['options'],
    mounted: function() {
        var that = this
        
        that.renderChart(that.chartData, that.options)

    },
    beforeDestroy: function() {
    }
})
