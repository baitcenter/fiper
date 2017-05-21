<template>
    <div class="fluid-wrapper flex justify-center">
        <div class="auth-form row inline auto items-center justify-center self-center">
            <div class="form-wrapper row auto wrap justify-center">
                <div v-if="!change_success" class="row wrap width-2of5 justify-center text-center">
                    <div class="auth-form-logo sm-width-3of3">
                        <img src="~statics/logo_text.png">
                    </div>
                </div>
                <success v-if="change_success"></success>
                <div v-if="!change_success" class="auth-form-content width-2of5 sm-width-4of5 wrap row auto">
                    <div class="greeting-wrapper row full-width rotateInDownLeft animated">
                        <span class="greeting label pointing-down text-white">explore your FIPER</span>
                    </div>
                    <div class="floating-label large-gutter">
                        <input type="password" required class="full-width validate" v-bind:class="{ 'has-error': $v.form.old_pin_code.$error }" v-model.trim="form.old_pin_code" v-on:input="$v.form.old_pin_code.$touch">
                        <label>OLD PIN CODE</label>
                        <span class="error-message" v-if="$v.form.old_pin_code.$error"> PIN CODE is required and must have minimum of {{ $v.form.old_pin_code.$params.minLength.min }} characters length. </span>
                    </div>
                    <div class="floating-label large-gutter">
                        <input type="password" required v-bind:class="{ 'has-error': $v.form.re_old_pin_code.$error }" class="full-width validate" v-model.trim="form.re_old_pin_code" v-on:input="$v.form.re_old_pin_code.$touch">
                        <label>RETYPE OLD PIN CODE</label>
                        <span class="error-message" v-if="$v.form.re_old_pin_code.$error"> PIN CODE is not match</span>
                    </div>
                    <div class="floating-label large-gutter">
                        <input type="password" required class="full-width validate" v-bind:class="{ 'has-error': $v.form.new_pin_code.$error }" v-on:input="$v.form.new_pin_code.$touch" v-model="form.new_pin_code">
                        <label>NEW PIN CODE</label>
                        <span class="error-message" v-if="$v.form.new_pin_code.$error"> PIN CODE is required and must have minimum of {{ $v.form.new_pin_code.$params.minLength.min }} characters length. </span>
                    </div>
                    <div class="row justify-center wrap">
                        <button class="green outline" @click="submit()">Submit</button>
                        <!-- <button class="green" @click="reset()">RESET</button> -->
                        <router-link tag="button" class="green" :to="'/'">Go Home</router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script type="text/javascript">
import Router from 'root_dir/router'
import Database from 'settings/database'
import {
    required,
    minLength,
    sameAs
} from 'vuelidate/lib/validators'


import {
    Toast
} from 'quasar'

import Success from 'components/alert/Success'
export default {
    mounted: function() {
        console.log(this.$parent)
    },
    data: function() {
        return {
            form: {
                old_pin_code: '',
                re_old_pin_code: '',
                new_pin_code: '',
            },
            change_success: false
        }
    },
    methods: {
        submit: function() {
            var that = this
            that.$v.form.$touch()
            if (that.$v.form.old_pin_code.$error) {
                const dialog = Toast.create.info({
                    title: 'Warning',
                    html: 'PIN CODE not matching'
                })
            } else {
                Database.get("pin_code").then(function(doc) {

                    if (that.form.old_pin_code != doc.CODE) {
                        const dialog = Toast.create.info({
                            title: 'Warning',
                            html: 'Wrong PIN CODE'
                        })
                        console.log('pin code: ' + doc.CODE)
                            // console.log(that.old_pin_code)
                    } else {
                        Database.put({
                            _id: doc._id,
                            _rev: doc._rev,
                            CODE: that.form.new_pin_code,
                            is_authed: doc.is_authed
                        }).then(function(result) {
                            console.log(result)

                            that.change_success = !that.change_success
                                // Router.push('/')
                        }).catch(function(err) {
                            console.log(err)
                        })
                    }
                    // console.log(doc.CODE)



                }).
                catch(function(err) {
                    console.log(err)
                })
            }



        },
        reset: function() {
            this.form.re_old_pin_code = ''
            this.form.new_pin_code = ''
            this.form.old_pin_code = ''
        }
    },
    validations: {
        form: {
            old_pin_code: {
                required,
                minLength: minLength(4)
            },
            re_old_pin_code: {
                required,
                sameAsPassword: sameAs('old_pin_code')
            },
            new_pin_code: {
                required,
                minLength: minLength(4)
            }
        }
    },
    components: {
        Success
    }
}
</script>
<style>
</style>
