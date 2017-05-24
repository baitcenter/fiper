<template>
    <div>This is analysis page</div>
</template>
<script>
import Bus from 'settings/event-bus'

export default {
    mounted: function() {
        Bus.$emit('receive_child_info', {
            page_title: 'Analysis',
            page_subtitle: ''
        })
    },
    data: function() {
        return {}
    }
}
</script>
<style>
</style>
