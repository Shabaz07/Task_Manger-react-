const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'task_tracker',
    password: 'root',
    port: 5432
});

module.exports = {
    pool
};