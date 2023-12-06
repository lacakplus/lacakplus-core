const db = require('../config/dbConfig.js');
const statusCode = require('../config/statusCode.js');

exports.addAtendance = (request, response) => {
    const userId = request.userId
    const id_company = request.body.id_company
    const attendance_at = request.body.attendance_at
    const status = request.body.status
    const photo = request.body.photo
    const location = request.body.location

    db.pool.query('INSERT INTO tr_attendance (id_company, attendance_at, status, photo, location, creator_id) VALUES (?, ?, ?, ?, ?, ?)', [id_company, attendance_at, status, photo, location, userId], (error, results) => {
        if (error) {
            response.status(statusCode.bad_request).json({
                code: statusCode.bad_request,
                message: error.message,
                error: error
            });
            return
        }
        var message = ""
        if (status == 0) {
            message = "Berhasil Clock In" + userId
        } else if (status == 1) {
            message = "Berhasil Clock Out" + userId
        }
        response.status(statusCode.success).json({
            code: statusCode.success,
            message: message
        });
    })
}