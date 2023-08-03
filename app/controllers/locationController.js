const db = require('../config/dbConfig.js');

exports.addLocation = (request, response) => {
    const userId = request.userId
    const id_company = request.body.id_company
    const name = request.body.name
    const email = request.body.email
    const phone = request.body.phone
    const lat = request.body.lat
    const lng = request.body.lng
    const address = request.body.address
    const type = request.body.type

    db.pool.query('INSERT INTO m_location (id_company, name, email, phone, lat, lng, address, type, creator_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [id_company, name, email, phone, lat, lng, address, type, userId], (error, results) => {
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
            message: "Berhasil menambahkan Lokasi"
        });
    })
}

exports.getAllLocation = (request, response) => {
    const id_company = request.body.id_company
    const type = request.body.type
    const search = request.body.search
    const limit = request.body.limit || 10

    var page = 0
    if (request.body.page > 0) {
        page = (request.body.page - 1) * limit
    }

    var query = "SELECT id, name, type FROM m_location WHERE flag = 1"

    query += (search != null? (" AND name like '%"+ search +"%'") : "")
    query += (id_company != null? (" AND id_company="+id_company) : "")
    query += (type != null? (" AND type="+type) : "")
    query += ((request.body.limit == null && request.body.page == null)? "" : (" LIMIT "+limit+" OFFSET "+page))

    query += " ORDER BY type"

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
            message: "Semua lokasi ditemukan",
            data: results
        });
    })
}

exports.getLocationByType = (request, response) => {
    const id_company = request.body.id_company
    const type = request.body.type

    db.pool.query('SELECT * FROM m_location WHERE id_company = ? AND type = ? AND flag = 1', [id_company, type], (error, results) => {
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
            message: "Lokasi ditemukan",
            data: results
        });
    })
}

exports.editLocation = (request, response) => {
    const id = request.body.id_location
    const name = request.body.name
    const email = request.body.email
    const phone = request.body.phone
    const lat = request.body.lat
    const lng = request.body.lng
    const address = request.body.address
    const updater_id = request.userId
    const type = request.body.type

    db.pool.query('UPDATE m_location SET name = ?, email = ?, phone = ?, lat = ?, lng = ?, address = ?, type = ?, updater_id = ?, updated_at = ? WHERE id = ?', 
        [name, email, phone, lat, lng, address, type, updater_id, new Date(), id], (error, results) => {
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
            message: "Berhasil edit Lokasi"
        });
    })
}

exports.deleteLocation = (request, response) => {
    const id = request.body.id_location
    const updater_id = request.userId
    
    db.pool.query('UPDATE m_location SET updater_id = ?, updated_at = ?, flag = 0 WHERE id = ?', [updater_id, new Date(), id], (error, results) => {
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
            message: "Berhasil hapus Lokasi"
        });
    })
}
