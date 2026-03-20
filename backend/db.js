const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "eventdb",
  password: "OrlandoUsa001212",
  port: 5433  
});

module.exports = pool;