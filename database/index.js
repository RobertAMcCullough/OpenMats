const mysql = require('mysql')

const keys = require('../config/keys')

const connection = mysql.createConnection({
    host: keys.dbHost,
    user: keys.dbUser,
    password: keys.dbPassword,
    database: keys.dbDatabase,
    port: keys.dbPort
})

module.exports = connection
