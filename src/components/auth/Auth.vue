<template>
    <div class="fluid-wrapper flex justify-center">
        <div class="auth-form row inline auto items-center justify-center self-center">
            <div class="form-wrapper row auto wrap justify-center">
                <!-- <div class="row justify-center text-center">
                    <div class="auth-form-logo sm-width-3of3">
                        <img src="../../assets/logo.png">
                    </div>
                </div> -->
                <div class="row wrap width-2of5 justify-center text-center">
                    <div class="auth-form-logo sm-width-3of3">
                        <img src="../../assets/logo_text.png">
                    </div>
                </div>
                <div class="auth-form-content width-2of5 sm-width-4of5 wrap row auto">
                    <div class="greeting-wrapper row full-width rotateInDownLeft animated">
                        <span class="greeting label pointing-down text-white">explore your FIPER</span>
                    </div>
                    <div class="floating-label large-gutter">
                        <input required class="full-width" v-model="username">
                        <label>Username</label>
                    </div>
                    <div class="floating-label large-gutter">
                        <input type="password" required class="full-width" v-model="password">
                        <label>Password</label>
                    </div>
                    <div class="row justify-center wrap">
                        <button class="primary outline" @click="login()">Login</button>
                        <button class="secondary" @click="login()">Register</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { Toast } from 'quasar'	
	
export default {
    data: function() {
        return {
            username: '',
            password: ''
        }

    },
    mounted: function(){
    	// console.log(this.database)
    },
    methods: {
        login: function() {
            // Take it easy first
            if (this.username == "khangtd" && this.password == "khangtd") {
                router.push('/');
            }
            if (this.username.length == 0 || this.password.length == 0) {
                const dialog = Toast.create.info({
                    title: 'Warning',
                    html: 'You need to fill the required fields.'
                })
            }
        }
    }

}
</script>
<style>
button {
    margin: 40px 5px;
}

.auth-form button.outline {
    color: white;
}

.auth-form span.greeting {
    width: auto;
    height: 50px;
    margin-left: 0px;
    background: transparent;
    border: solid 1px;
}

.auth-form {
    color: white!important;
}

.auth-form label,
.auth-form input {
    color: white!important;
}

.auth-form label {
    font-size: 13px;
}

div.fluid-wrapper {
    width: 100%;
    height: 100%;
    background: green;
    position: absolute;
}
</style>
