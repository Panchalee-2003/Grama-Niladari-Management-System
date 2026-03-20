const pool = require('../config/db');

async function main() {
    try {
        const query1 = `SELECT cr.request_id, cr.cert_type, cr.status, cr.certificate_id,
                    c.full_name AS citizen_name, u.email AS citizen_email,
                    COALESCE(fm.full_name, c.full_name) AS applicant_name
             FROM certificate_request cr
             JOIN citizen c ON c.citizen_id = cr.citizen_id
             JOIN user_table u ON u.user_id = c.user_id
             LEFT JOIN family_member fm ON fm.member_id = cr.family_member_id
             WHERE cr.request_id = 1`;
        await pool.query(query1);
        console.log("SELECT OK!");

        const query2 = `UPDATE certificate_request
                 SET status='VISIT_REQUIRED', gn_remarks='test', appointment_date='2026-04-07',
                     required_documents_list='NIC', updated_at=NOW()
                 WHERE request_id=1
                 RETURNING *`;
        await pool.query(query2);
        console.log("UPDATE OK!");

        process.exit(0);
    } catch (e) {
        console.error("ERROR:");
        console.error(e.message);
        process.exit(1);
    }
}
main();
