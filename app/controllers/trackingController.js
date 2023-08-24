const db = require('../config/dbConfig.js');

exports.addTracking = (request, response) => {
    //Data Tracking
    const userId = request.userId
    const data_tracking = request.body.data_tracking

    let values = [];
    for (let i = 0; i < data_tracking.length; i++) {
        values.push([userId, data_tracking[i].id_travel, data_tracking[i].lat, data_tracking[i].lng])
    }
    db.pool.query('INSERT INTO tr_tracking (id_driver, id_travel, lat, lng) VALUES ?', [values], (error, results) => {
        if (error) {
            response.json({
                code: 400,
                message: error.message,
                error: error
            });
            return
        }
        response.json({
            code: 200,
            message: "Data tracking berhasil di tambahkan"
        });
    })
}

exports.getTracking = (request, response) => {
    const id_travel = request.body.id_travel

    db.pool.query('SELECT * FROM tr_tracking WHERE id_travel = ?', [id_travel], (error, results) => {
        if (error) {
            response.json({
                code: 400,
                message: error.message,
                error: error
            });
            return
        }
        response.json({
            code: 200,
            message: "Data tracking berhasil di tambahkan",
            data: results
        });
    })
}

exports.getVehiclePos = (request, response) => {
    const id_company = request.body.id_company

    const query = 'SELECT g.name, tr.lat, tr.lng, tr.created_at FROM tr_tracking tr '+
        'JOIN tr_travel tv ON tv.id = tr.id_travel '+
        'JOIN ( '+
            'SELECT v.id, MAX(tr.created_at) AS max_date, v.name FROM tr_tracking tr '+
            'JOIN tr_travel tv ON tv.id = tr.id_travel AND tv.id_company = ? '+
            'JOIN m_vehicle v ON v.id = tv.id_vehicle '+
            'GROUP BY v.id, v.name '+
        ') g ON g.id = tv.id_vehicle AND g.max_date = tr.created_at'

    db.pool.query(query, [id_company], (error, results) => {
        if (error) {
            response.json({
                code: 400,
                message: error.message,
                error: error
            });
            return
        }
        response.json({
            code: 200,
            message: "Data posisi kendaraan berhasil diambil",
            data: results
        });
    })
}