const db = require('../config/dbConfig.js');

exports.addTracking = (request, response) => {
    //Data Tracking
    const userId = request.userId
    const id_travel = request.body.id_travel
    const lat = request.body.lat
    const lng = request.body.lng

    db.pool.query('INSERT INTO tr_tracking (id_driver, id_travel, lat, lng) VALUES (?, ?, ?, ?)', [userId, id_travel, lat, lng], (error, results) => {
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