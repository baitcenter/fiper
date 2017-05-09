<template>
    <div>HOME PAGE</div>
</template>
<script type="text/javascript">
import Database from 'settings/database'
import Router from 'root_dir/router'
export default {
    data: function() {
        return {

        }
    },
    mounted: function() {
        // Database.get("pin_code").then(function(doc) {
        //     console.log(doc)
        //     if (!doc.is_authed) {
        //         Router.push('/login')
        //     }
        // }).catch(function(err) {
        //     Router.push('/login')
        // })
    }
}
</script>
<style type="text/css"></style>
