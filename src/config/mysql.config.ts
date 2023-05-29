import * as db from 'mysql2'

export const mysql: db.Connection = db.createConnection({
  host: process.env.HOST,
  user: process.env.MYSQL_DB_USER,
  password: process.env.MYSQL_DB_PASSWORD,
  database: process.env.MYSQL_DB_NAME
})

