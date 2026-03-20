const pool = require('../config/db');

async function main() {
    try {
        const views = await pool.query(`
            SELECT viewname, definition 
            FROM pg_views 
            WHERE schemaname = 'public' 
              AND definition LIKE '%users%';
        `);
        console.log("VIEWS:", views.rows);

        const funcs = await pool.query(`
            SELECT proname, prosrc 
            FROM pg_proc 
            WHERE prosrc LIKE '%users%';
        `);
        console.log("\nFUNCTIONS:", funcs.rows);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
main();
