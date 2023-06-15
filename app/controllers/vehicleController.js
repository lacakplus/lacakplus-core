const db = require('../config/dbConfig.js');

exports.getVehicle = (request, response) => {
    const id = request.body.id_vehicle
    db.pool.query('SELECT * FROM m_vehicle WHERE id = ? AND flag = 1', [id], (error, results) => {
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
                message: "Kendaraan tidak ditemukan"
            });
            return
        }
        response.json({
            code: 200,
            message: "Kendaraan ditemukan",
            data: results
        });
    })
}

exports.getVehicles = (request, response) => {
    const id = request.body.id_company
    db.pool.query('SELECT * FROM m_vehicle WHERE id_company = ? AND flag = 1', [id], (error, results) => {
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
                message: "Kendaraan tidak ditemukan"
            });
            return
        }
        response.json({
            code: 200,
            message: "Kendaraan ditemukan",
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

    db.pool.query('SELECT * FROM m_vehicle WHERE no_plate = ? AND flag = 1', [no_plate], (error, results) => {
        if (error) {
            response.json({
                code: 400,
                message: error.message,
                error: error
            });
            return
        }
        if (results.length != 0) {
            response.json({
                code: 401,
                message: "Plat nomor sudah pernah digunakan"
            });
            return
        }
        db.pool.query('INSERT INTO m_vehicle (id_company, no_plate, name, brand, type, bought_year, kilometers, creator_id, updater_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [id_company, no_plate, name, brand, type, bought_year, kilometers, creator_id, updater_id], (error, results) => {
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
                message: "Kendaraan Berhasil Ditambahkan"
            });
        })
    })
}

exports.editVehicle = (request, response) => {
    const id_vehicle = request.body.id_vehicle
    const id_company = request.body.id_company
    const no_plate = request.body.no_plate
    const name = request.body.name
    const brand = request.body.brand
    const type = request.body.type
    const bought_year = request.body.bought_year
    const kilometers = request.body.kilometers
    const updater_id = request.userId

    db.pool.query('SELECT * FROM m_vehicle WHERE no_plate = ? AND flag = 1', [no_plate], (error, results) => {
        if (error) {
            response.json({
                code: 400,
                message: error.message,
                error: error
            });
            return
        }
        if (results.length != 0) {
            response.json({
                code: 401,
                message: "Plat nomor sudah pernah digunakan"
            });
            return
        }
        db.pool.query('UPDATE m_vehicle SET id_company = ?, no_plate = ?, name = ?, brand = ?, type = ?, bought_year = ?, kilometers = ?, updater_id = ?, updated_at = ? WHERE id = ?', 
            [id_company, no_plate, name, brand, type, bought_year, kilometers, updater_id, new Date(), id_vehicle], (error, results) => {
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
                message: "Kendaraan Berhasil Diedit"
            });
        })
    })
}

exports.deleteVehicle = (request, response) => {
    const id_vehicle = request.body.id_vehicle
    const updater_id = request.userId
    
    db.pool.query('UPDATE m_vehicle SET updater_id = ?, updated_at = ?, flag = 0 WHERE id = ?', [updater_id, new Date(), id_vehicle], (error, results) => {
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
            message: "Kendaraan Berhasil Dihapus"
        });
    })
}
