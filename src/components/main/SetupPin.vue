<template>
    <div class="fluid-wrapper flex justify-center">
        <div class="auth-form row inline auto items-center justify-center self-center">
            <div class="form-wrapper row auto wrap justify-center">
                <!-- <div class="row justify-center text-center">
                    <div class="auth-form-logo sm-width-3of3">
                        <img src="../../assets/logo.png">
                    </div>
                </div> -->
                <div v-if="!change_success" class="row wrap width-2of5 justify-center text-center">
                    <div class="auth-form-logo sm-width-3of3">
                        <img src="~statics/logo_text.png">
                    </div>
                </div>
                <success v-if="change_success"></success>
                <div v-if="!change_success" class="auth-form-content width-2of5 sm-width-4of5 wrap row auto">
                    <div class="greeting-wrapper row full-width rotateInDownLeft animated">
                        <span class="greeting label pointing-down text-white">setup your FIPER code</span>
                    </div>
                    <!--  <div class="floating-label large-gutter">
                        <input required class="full-width" v-model="username">
                        <label>Username</label>
                    </div> -->
                    <div class="floating-label large-gutter">
                        <input type="password" required v-bind:class="{'has-error': $v.form.pin_code.$error}" v-on:input="$v.form.pin_code.$touch" class="full-width validate" v-model.number="form.pin_code">
                        <label>PIN CODE</label>
                        <span class="error-message" v-if="$v.form.pin_code.$error"> PIN CODE is required and must have minimum of {{ $v.form.pin_code.$params.minLength.min }} characters length. </span>
                    </div>
                    <div class="floating-label large-gutter">
                        <input type="password" required v-bind:class="{'has-error': $v.form.re_pin_code.$error}" v-on:input="$v.form.re_pin_code.$touch" class="full-width validate" v-model.number="form.re_pin_code">
                        <label>RETYPE PIN CODE</label>
                        <span class="error-message" v-if="$v.form.re_pin_code.$error"> PIN CODE not match </span>
                    </div>
                    <div class="row justify-center wrap">
                        <button id="setup-pin" class="green outline" @click="submit()">Submit</button>
                        <button id="reset-pin" class="green" @click="reset()">Reset</button>
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
import Success from 'components/alert/Success'

import Database from 'settings/database'
import Router from 'root_dir/router'
import {
    required,
    minLength,
    sameAs
} from 'vuelidate/lib/validators'
export default {
    data: function() {
        return {
            form: {
                pin_code: '',
                re_pin_code: ''
            },
            change_success: false
        }
    },
    mounted: function() {

    },
    methods: {
        submit: function() {
            this.$v.form.$touch()
            var that = this

            // Setup PIN CODE for the first time
            Database.get("first_login").then(function(doc_first_login) {
                // console.log(doc_first_login)
                if (doc_first_login.status) {
                    // If first login, then allowed to generate a new pin code
                    if (!that.$v.form.$error) {
                        // Setup auth table
                        Database.get("pin_code").then(function(doc_pin_code) {
                            console.log('already have pin_code, redirect to home')
                            Router.push('/') // Redirect to home if already have pin code data
                        }).catch(function(err) {
                            console.log(err)
                            if (err.name === 'not_found') {
                                // If not have pin code data, then create one
                                return Database.put({
                                    _id: "pin_code",
                                    CODE: that.form.pin_code,
                                    is_authed: false,
                                }).then(function(res) {
                                    console.log("Updated " + res.toString())
                                    console.log('created new pin code success fully, redirect to home')
                                    that.change_success = true
                                    doc_first_login.status = false
                                    console.log(doc_first_login)
                                    Database.put(doc_first_login)
                                }).catch(function(err) {
                                    console.log(err)
                                })
                            } else { // hm, some other error
                                throw err
                            }

                        })

                    }

                } else {
                    // If not first login, redirect to home
                    Router.push('/')
                }

            }).catch(function(err) {
                console.log(err)
                if (err.name === 'not_found') {
                    console.log(err)
                    if (err.name === 'not_found') {
                        console.log("not found, must be initialized")
                    } else { // hm, some other error
                        throw err
                    }

                } else { // hm, some other error
                    throw err
                }

            })



        },
        reset: function() {
            this.form.pin_code = ''
            this.form.re_pin_code = ''
        }
    },
    components: {
        Success
    },
    validations: {
        form: {
            pin_code: {
                required,
                minLength: minLength(4)
            },
            re_pin_code: {
                required,
                minLength: sameAs('pin_code')
            }
        }
    }

}
</script>
<style>
</style>
