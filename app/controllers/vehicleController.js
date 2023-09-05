const db = require('../config/dbConfig.js');

exports.getVehicleById = (request, response) => {
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
            data: results[0]
        });
    })
}

exports.getVehicles = (request, response) => {
    const id_company = request.body.id_company
    const search = request.body.search
    const limit = request.body.limit || 10
 
    var page = 0
    if (request.body.page > 0) {
        page = (request.body.page - 1) * limit
    }

    var query = 'SELECT id, name, no_plate, type, kilometers FROM m_vehicle WHERE flag = 1'

    query += (search != null? (" AND (name like '%"+ search +"%' OR no_plate like '%"+ search +"%' OR type like '%"+ search +"%')") : "")
    query += (id_company != null? (" AND id_company="+id_company) : "")
    query += ((request.body.limit == null && request.body.page == null)? "" : (" LIMIT "+limit+" OFFSET "+page)) 

    db.pool.query(query, [id_company, limit, page], (error, results) => {
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

    db.pool.query('SELECT * FROM m_vehicle WHERE no_plate = ? AND flag = 1 AND id_company = ?', [no_plate, id_company], (error, results) => {
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
        db.pool.query('INSERT INTO m_vehicle (id_company, no_plate, name, brand, type, bought_year, kilometers, creator_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [id_company, no_plate, name, brand, type, bought_year, kilometers, creator_id], (error, results) => {
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
                message: "Kendaraan berhasil ditambahkan"
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
    const date = new Date()

    db.pool.query('SELECT * FROM m_vehicle WHERE no_plate = ? AND id_company = ? AND flag = 1 AND id <> ?', [no_plate, id_company, id_vehicle], (error, results) => {
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

        var query = "UPDATE m_vehicle SET updated_at = '"+date+"', updater_id = "+updater_id

        query += (id_company != null? (", id_company = "+id_company) : "")
        query += (no_plate != null? (", no_plate = '"+no_plate+"'") : "")
        query += (name != null? (", name = '"+name+"'") : "")
        query += (brand != null? (", brand = '"+brand+"'") : "")
        query += (type != null? (", type = '"+type+"'") : "")
        query += (bought_year != null? (", bought_year = "+bought_year) : "")
        query += (kilometers != null? (", kilometers = "+kilometers) : "")

        query += " WHERE id = "+id_vehicle

        db.pool.query(query, (error, results) => {
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
                message: "Berhasil edit Kendaraan"
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
            message: "Berhasil hapus Kendaraan"
        });
    })
}
