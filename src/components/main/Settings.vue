<template>
    <h1>Setting Page</h1>
</template>
<script type="text/javascript">
import Bus from 'settings/event-bus'

export default {
    mounted: function() {
        Bus.$emit('receive_child_info', {
            page_title: 'Settings',
            page_subtitle: ''
        })
    }
}
</script>
<style type="text/css"></style>
