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

exports.getLocations = (request, response) => {
    const id_company = request.body.id_company
    const type = request.body.type
    const search = request.body.search
    const limit = request.body.limit || 10

    var page = 0
    if (request.body.page > 0) {
        page = (request.body.page - 1) * limit
    }

    var query = "SELECT id, name, type, phone, lat, lng, address FROM m_location WHERE flag = 1"

    query += (search != null? (" AND name like '%"+ search +"%'") : "")
    query += (id_company != null? (" AND id_company="+id_company) : "")
    query += (type != null? (" AND type="+type) : "")
    query += " ORDER BY type"
    query += ((request.body.limit == null && request.body.page == null)? "" : (" LIMIT "+limit+" OFFSET "+page))

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

exports.getLocationById = (request, response) => {
    const id = request.body.id_location

    db.pool.query('SELECT * FROM m_location WHERE id = ? AND flag = 1', [id], (error, results) => {
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
            data: results[0]
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
    const date = new Date()

    var query = "UPDATE m_location SET updated_at = '"+date+"', updater_id = "+updater_id

    query += (name != null? (", name = '"+name+"'") : "")
    query += (email != null? (", email = '"+email+"'") : "")
    query += (phone != null? (", phone = '"+phone+"'") : "")
    query += (lat != null? (", lat = "+lat) : "")
    query += (lng != null? (", lng = "+lng) : "")
    query += (address != null? (", address = '"+address+"'") : "")
    query += (type != null? (", type = '"+type+"'") : "")

    query += " WHERE id = "+id
    
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
