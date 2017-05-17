import router from 'root_dir/router'
require('pouchdb-browser')
var PouchDB = require('pouchdb-browser')
var Database = new PouchDB('local_db', { adapter: 'websql' })

// Setup PIN CODE for the first time
Database.get("first_login").then(function(doc) {
    // console.log(doc)
}).catch(function(err) {
    console.log(err)
    if (err.name === 'not_found') {
        return Database.put({
            _id: "first_login",
            status: true
        }).then(function(res) {
            console.log("Updated " + res.toString() + ', redirect to home')

            router.push('/')
        }).catch(function(err) {
            console.log(err)
        })
    } else { // hm, some other error
        throw err
    }

})
