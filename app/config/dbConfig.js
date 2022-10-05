const env = require('./env.js');
const mySql = require('mysql');

const pool = mySql.createPool({
  user: env.username,
  host: env.host,
  password: env.password,
  database: env.database,
})

// const pool = new Pool({
//   user: env.username,
//   host: env.host,
//   password: env.password,
//   database: env.database,
//   port: env.port,
//   ssl: {
//     rejectUnauthorized: false
//   }
// })

module.exports = {
  pool,
}