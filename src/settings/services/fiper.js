import moment from 'moment'
require('pouchdb-browser')
var PouchDB = require('pouchdb-browser')
var Database = new PouchDB('local_db', { adapter: 'websql' })

function setFiper(data) {
    var fiper_key = data.fiper_root_type
    var date = new Date(data.fiper_date)
    
}
