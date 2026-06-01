const { Pool } = require("pg");

const pool = new Pool({
    user: "prakarshverma",
    host: "localhost",
    database: "url_shortener",
    port: 5432,
});

module.exports = pool;