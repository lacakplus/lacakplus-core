const db = require('../config/dbConfig.js');
const statusCode = require('../config/statusCode.js');
const baseError = require("../middleware/error.js");

exports.addAtendance = (request, response) => {
    const user_id = request.user_id
    const id_company = request.body.id_company
    const attendance_at = request.body.attendance_at
    const status = request.body.status
    const photo = request.body.photo
    const location = request.body.location

    const queryString = "INSERT INTO tr_attendance (id_company, attendance_at, status, photo, location, creator_id) VALUES (?, ?, ?, ?, ?, ?)"
    db.pool.query(queryString, [id_company, attendance_at, status, photo, location, user_id], (error, results) => {
        baseError.handleError(error, response)

        let message = (status == 0) ? "Berhasil Clock In" : "Berhasil Clock Out"
        response.status(statusCode.success).send({
            code: statusCode.success,
            message: message
        });
    })
}