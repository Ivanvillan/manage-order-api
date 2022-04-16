const { config } = require('./../config/config');
const mysql = require('mysql');

const db = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.pass,
    database: config.db
})

module.exports = db;