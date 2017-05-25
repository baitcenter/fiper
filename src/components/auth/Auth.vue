<template>
    <div class="fluid-wrapper flex justify-center">
        <div class="auth-form row inline auto items-center justify-center self-center">
            <div class="form-wrapper row auto wrap justify-center">
        
                <div class="row wrap width-2of5 justify-center text-center">
                    <div class="auth-form-logo sm-width-3of3">
                        <img src="~statics/logo_text.png">
                    </div>
                </div>
                <div class="auth-form-content width-2of5 sm-width-4of5 wrap row auto">
                    <div class="greeting-wrapper row full-width rotateInDownLeft animated">
                        <span class="greeting label pointing-down text-white">explore your FIPER</span>
                    </div>
                   
                    <div class="floating-label large-gutter">
                        <input type="password" required v-bind:class="{'has-error': $v.pin_code.$error}" v-on:input="$v.pin_code.$touch" class="full-width validate" v-model.number="pin_code">
                        <label>PIN CODE</label>
                        <span class="error-message" v-if="$v.pin_code.$error"> PIN CODE is required and must have minimum of {{ $v.pin_code.$params.minLength.min }} characters length. </span>
                    </div>
                    <div class="row justify-center wrap">
                        <button id="auth-login" class="green outline" @click="login()">Login</button>
                        <button class="green" @click="register()">Change PIN CODE</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {
    Toast
} from 'quasar'
import Database from 'settings/database'
import Router from 'root_dir/router'
import {
    required,
    minLength
} from 'vuelidate/lib/validators'
export default {
    data: function() {
        return {
            pin_code: '',
        }
    },
    mounted: function() {
        
    },
    methods: {
        login: function() {
            this.$v.pin_code.$touch()

            if (this.$v.pin_code.$error) {
                const dialog = Toast.create.info({
                    title: 'Warning',
                    html: 'You need to fill the required fields.'
                })
                return false
            }
            var cur_pincode = ''
            var that = this
                // Take it easy first
            Database.get("pin_code").then(function(doc) {
                // console.log(doc)
                cur_pincode = doc.CODE
                if (that.pin_code == cur_pincode) {
                    console.log("Logged in" + " " + "[" + cur_pincode + " != " + that.pin_code + "]")
                    Database.put({
                        _id: doc._id,
                        _rev: doc._rev,
                        is_authed: true,
                        CODE: doc.CODE
                    })
                    Router.push("/")
                } else {
                    console.log("Wrong pin_code [" + cur_pincode + " != " + that.pin_code + "]")
                    const dialog = Toast.create.info({
                    title: 'Warning',
                    html: 'Wrong password!'
                })
                return false
                }
            }).catch(function(err) {
                console.log(err)
            });
        },
        register: function() {
            Router.push('/pinreset')
        }
    },
    components: {},
    validations: {
        pin_code: {
            required,
            minLength: minLength(4)
        }
    }

}
</script>
<style>

</style>
