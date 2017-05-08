require('pouchdb-browser')
var PouchDB = require('pouchdb-browser')
var Database = new PouchDB('local_db', { adapter: 'websql' })

// Setup auth table
Database.get("pin_code").then(function(doc) {
    console.log(doc)
}).catch(function(err) {
    console.log(err)
    if (err.name === 'not_found') {
        return Database.put({
            _id: "pin_code",
            CODE: "123456",
            is_authed: false,
        }).then(function(res) {
            console.log("Updated " + res.toString())
        }).catch(function(err) {
            console.log(err)
        })
    } else { // hm, some other error
        throw err
    }

})
