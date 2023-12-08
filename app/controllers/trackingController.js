const db = require('../config/dbConfig.js');
const statusCode = require('../config/statusCode.js');
const baseError = require("../middleware/error.js");

exports.addTracking = (request, response) => {
    //Data Tracking
    // const isClearLagTime = request.is_clear_lag
    const user_id = request.user_id
    const data_tracking = request.body.data_tracking

    let values = [];
    for (let i = 0; i < data_tracking.length; i++) {
        values.push([user_id, data_tracking[i].id_travel, data_tracking[i].lat, data_tracking[i].lng, data_tracking[i].signal_strength])
    }

    let queryString = "INSERT INTO tr_tracking (id_driver, id_travel, lat, lng, signal_strength) VALUES ?"
    db.pool.query(queryString, [values], (error, results) => {
        baseError.handleError(error, response)

        // if (isClearLagTime) {
        //     db.pool.query('UPDATE tr_travel set lag_time = 0 WHERE id_travel = ?', [data_tracking,slice(-1).id_travel], (error, results) => {
                
        //     })
        // }
        response.status(statusCode.success).send({
            code: statusCode.success,
            message: "Data tracking berhasil di tambahkan"
        });
    })
}

exports.getTrackings = (request, response) => {
    const id_travel = request.body.id_travel

    let queryString = "SELECT * FROM tr_tracking WHERE id_travel = ?"
    db.pool.query(queryString, [id_travel], (error, results) => {
        baseError.handleError(error, response)
        
        response.status(statusCode.success).send({
            code: statusCode.success,
            message: "Data tracking ditemukan",
            data: results
        });
    })
}

exports.getPositionVehicles = (request, response) => {
    const id_company = request.body.id_company

    const query = "SELECT g.name, tr.lat, tr.lng, tv.status, tr.created_at FROM tr_tracking tr "+
        "JOIN tr_travel tv ON tv.id = tr.id_travel "+
        "JOIN ( "+
            "SELECT v.id, MAX(tr.created_at) AS max_date, v.name FROM tr_tracking tr "+
            "JOIN tr_travel tv ON tv.id = tr.id_travel AND tv.id_company = ? "+
            "JOIN m_vehicle v ON v.id = tv.id_vehicle "+
            "GROUP BY v.id, v.name "+
        ") g ON g.id = tv.id_vehicle AND g.max_date = tr.created_at"

    db.pool.query(query, [id_company], (error, results) => {
        baseError.handleError(error, response)

        response.status(statusCode.success).send({
            code: statusCode.success,
            message: "Data posisi kendaraan ditemukan",
            data: results
        });
    })
}