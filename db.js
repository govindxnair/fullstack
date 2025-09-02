const sql = require('mssql')
require("dotenv").config();
const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
        encrypt: false,
        enableArithAbort: true
    },
    port: parseInt(process.env.DB_PORT)
}

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to MSSQL')
        return pool
    })
    .catch(err => {
        console.log('Database Connection Failed!: ', err)
        throw err;

    });

module.exports = {
    sql,
    poolPromise
};  