<template>
    <!-- Don't drop "q-app" class -->
    <div id="q-app">
        <router-view></router-view>
    </div>
</template>
<script>
/*
 * Root component
 */
import { Database } from 'settings/settings'
import Bus from 'settings/event-bus'
import router from 'root_dir/router'
export default {
    data: function() {
        return {
            database: Database,
            global_text: 'Hello',

        }
    },
    mounted: function() {
    },
}
</script>
<style></style>
