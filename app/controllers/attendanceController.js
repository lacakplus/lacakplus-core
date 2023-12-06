import { pool } from '../config/dbConfig.js';
import { bad_request, success } from '../config/statusCode.js';

export function addAtendance(request, response) {
    const user_id = request.user_id
    const id_company = request.body.id_company
    const attendance_at = request.body.attendance_at
    const status = request.body.status
    const photo = request.body.photo
    const location = request.body.location

    const queryString = 'INSERT INTO tr_attendance (id_company, attendance_at, status, photo, location, creator_id) VALUES (?, ?, ?, ?, ?, ?)'
    pool.query(queryString, [id_company, attendance_at, status, photo, location, user_id], (error, results) => {
        if (error) {
            return response.status(bad_request).send({
                code: bad_request,
                message: error.message,
                error: error
            });
        }

        let message = (status == 0) ? "Berhasil Clock In" : "Berhasil Clock Out"
        response.status(success).send({
            code: success,
            message: message
        });
    })
}