var path = require('path')

import Database from './database'
var ROOT_PATH = path.resolve(__dirname,'../')
var STATIC_URL = 'statics/'
export {
	Database,
	ROOT_PATH,
	STATIC_URL
}