<template>
    <q-layout>
        <div slot="header" class="toolbar">
            <button class="hide-on-drawer-visible" @click="$refs.drawer.open()">
                <i>menu</i>
            </button>
            <q-toolbar-title :padding="2">
                Hi Khang, you spent 20% the plan.
            </q-toolbar-title>
        </div>
        <q-drawer ref="drawer">
            <div class="list platform-delimiter">
                <div class="list-header">
                    Hi Khang,
                </div>
                <q-drawer-link icon="mail" to="/account">View Report</q-drawer-link>
                <q-drawer-link icon="alarm" to="/alarms">View Payments</q-drawer-link>
            </div>
        </q-drawer>
        <!--
      Replace following "div" with
      "<router-view class="layout-view">" component
      if using subRoutes
    -->
        <div class="layout-view"></div>
    </q-layout>
</template>
<script>
import {
    Utils
} from 'quasar'
import Router from '../router';
export default {
    data() {
            return {
                id: Utils.uid(),
            }
        },
        computed: {

        },
        methods: {

        },
        mounted() {
            Router.push('/login');
        },
        beforeDestroy() {

        },
        components: {

        }

}
</script>
<style>
</style>
