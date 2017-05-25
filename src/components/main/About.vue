<template>
    <div class="about-form fluid-wrapper flex justify-center bg-white">
        <div class="about-form row inline auto items-center justify-center self-center">
            <div class="form-wrapper row auto wrap justify-center">
                <div class="row wrap width-2of5 justify-center text-center">
                    <div class="auth-form-logo sm-width-3of3">
                        <img src="~statics/android_logo.png">
                    </div>
                </div>
                <div class="width-2of5 sm-width-4of5">
                    <div class="about-form-content">
                        <div class="greeting-wrapper row full-width rotateInDownLeft animated">
                            <span class="greeting label pointing-down green outline">explore your FIPER</span>
                        </div>
                        <h6 class="text-left">What is Fiper?</h6>
                        <span>
                            Fiper is a word combined by "Finance" and "Performance". The Fiper app will help you summarize your finance's performance during the time.
                        </span>
                        <!-- <h6>FIPER is easy to use?</h6>
                        <div>
                            Yes, FIPER is very easy to use. We also make beautiful charts for you, too.
                        </div> -->
                        <!--    <h6>Is FIPER free?</h6>
                        <div>
                            Yes, you are using Community Edition of FIPER, and it's free. We're gonna release an Enterprise one with more amazing features.
                        </div> -->
                        <h6 class="text-left">Is Fiper open-source?</h6>
                        <div>
                            Yes, Fiper is an open-source software. We strongly appreciate your contribution and please feel free to make a pull request from this repo by clicking on Github logo below.
                        </div>
                        <div class="about-action row wrap items-center justify-center">
                            <router-link tag="button" class="green" :to="'/'">Go Home</router-link>
                            <button class="forking-action" >
                                <img src="~statics/github.png">
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script type="text/javascript">
import Bus from 'settings/event-bus'

export default {
    mounted: function() {
        Bus.$emit('receive_child_info', {
            page_title: 'About',
            page_subtitle: ''
        })
    }
}
</script>
<style type="text/css"></style>
