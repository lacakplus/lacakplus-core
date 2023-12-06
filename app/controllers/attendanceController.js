const db = require('../config/dbConfig.js');
const statusCode = require('../config/statusCode.js');

exports.addAtendance = (request, response) => {
    const userId = request.userId
    const id_company = request.body.id_company
    const attendance_at = request.body.attendance_at
    const status = request.body.status
    const photo = request.body.photo
    const phone = request.body.phone
    const location = request.body.location

    db.pool.query('INSERT INTO tr_attendance (id_company, attendance_at, status, photo, phone, location, creator_id) VALUES (?, ?, ?, ?, ?, ?)', [id_company, attendance_at, status, photo, phone, location, userId], (error, results) => {
        if (error) {
            response.statusCode = statusCode.bad_request
            response.json({
                code: statusCode.bad_request,
                message: error.message,
                error: error
            });
            return
        }
        response.statusCode = statusCode.success
        response.json({
            code: statusCode.success,
            message: "Data tracking ditemukan"
        });
    })
}