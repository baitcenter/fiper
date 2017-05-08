require('pouchdb-browser')
require('./seeding_db')
var PouchDB = require('pouchdb-browser')
var Database = new PouchDB('local_db',{adapter: 'websql'})

export default Database
