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

    let queryString = "INSERT INTO tr_attendance (id_company, attendance_at, status, photo, location, creator_id) VALUES (?, ?, ?, ?, ?, ?)"
    db.pool.query(queryString, [id_company, attendance_at, status, photo, location, user_id], (error, results) => {
        baseError.handleError(error, response)

        let message = (status == 0) ? "Berhasil Clock In" : "Berhasil Clock Out"
        response.status(statusCode.success).send({
            code: statusCode.success,
            message: message
        });
    })
}

exports.getAttendanceToday = (request, response) => {
    const user_id = request.user_id

    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    
    let dateNow = year + "-" + month + "-" + date
    
    let queryString = "SELECT * FROM tr_attendance WHERE id = ? AND flag = 1 AND attendance_at = ?"
    db.pool.query(queryString, [user_id, dateNow], (error, results) => {
        baseError.handleError(error, response)

        response.status(statusCode.success).send({
            code: statusCode.success,
            message: message,
            data: results
        });
    })
}