<template>
</template>
<script>
import Router from "root_dir/router"
import Database from "settings/database"
export default {
    data: function() {
        return {

        }
    },
    mounted: function() {
        Database.get("pin_code").then(function(doc) {
            console.log(doc)
            Database.put({
                _id: doc._id,
                _rev: doc._rev,
                is_authed: false,
                CODE: doc.CODE
            }).then(function(res) {
                console.log(res)
                Router.push('/')
            }).catch(function(err) {
                console.log(err)
            })
        }).catch(function(err) {
            console.log(err)
        })
    }

}
</script>
<style type="text/css">
</style>
