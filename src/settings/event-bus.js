import Vue from 'vue'

var bus = new Vue()

bus.$on('test',function(test){
	console.log(test)
})


export default bus