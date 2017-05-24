<template>
    <div class="chart-wrapper">
        <h2>Trending Page</h2>
        <chart></chart>
    </div>
</template>
<script type="text/javascript">
import Bus from 'settings/event-bus'
import Chart from './Chart'
export default {
    mounted: function() {
        Bus.$emit('receive_child_info', {
            page_title: 'Trending',
            page_subtitle: ''
        })
    },
    components: {
        Chart
    }
}
</script>
<style type="text/css"></style>
