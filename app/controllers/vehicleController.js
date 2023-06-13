const db = require('../config/dbConfig.js');

exports.getVehicles = (request, response) => {
    const id = request.body.id_company
    db.pool.query('SELECT * FROM m_vehicle WHERE id_company = ?', [id], (error, results) => {
        if (error) {
            response.json({
                code: 400,
                message: error.message,
                error: error
            });
            return
        }
        if (results.length == 0) {
            response.json({
                code: 401,
                message: "Vehicle tidak ditemukan"
            });
            return
        }
        response.json({
            code: 200,
            message: "Vehicle ditemukan",
            data: results
        });
    })
}

exports.addVehicle = (request, response) => {
    const id_company = request.body.id_company
    const no_plate = request.body.no_plate
    const name = request.body.name
    const brand = request.body.brand
    const type = request.body.type
    const bought_year = request.body.bought_year
    const kilometers = request.body.kilometers
    const creator_id = request.userId
    const updater_id = request.userId

    db.pool.query('INSERT INTO m_user (id_company, no_plate, name, brand, type, bought_year, kilometers, creator_id, updater_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [id_company, no_plate, name, brand, type, bought_year, kilometers, creator_id, updater_id], (error, results) => {
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
            message: "Penambahan Kendaraan Berhasil"
        });
    })
}
