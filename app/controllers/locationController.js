const db = require('../config/dbConfig.js');
const statusCode = require('../config/statusCode.js');
const baseError = require("../middleware/error.js");

exports.addLocation = (request, response) => {
    const user_id = request.user_id
    const id_company = request.body.id_company
    const name = request.body.name
    const email = request.body.email
    const phone = request.body.phone
    const lat = request.body.lat
    const lng = request.body.lng
    const address = request.body.address
    const type = request.body.type

    let queryString = "INSERT INTO m_location (id_company, name, email, phone, lat, lng, address, type, creator_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    db.pool.query(queryString, [id_company, name, email, phone, lat, lng, address, type, user_id], (error, results) => {
        baseError.handleError(error, response)
        
        response.send({
            code: statusCode.success,
            message: "Berhasil Menambahkan Lokasi"
        });
    })
}

exports.getLocations = (request, response) => {
    const id_company = request.body.id_company
    const type = request.body.type
    const search = request.body.search
    const limit = request.body.limit || 10

    let page = (request.body.page > 0) ? (request.body.page - 1) * limit : 0

    var queryString = "SELECT id, name, type, phone, lat, lng, address FROM m_location WHERE flag = 1"
    queryString += (search != null ? (" AND name like '%"+ search +"%'") : "")
    queryString += (id_company != null ? (" AND id_company="+id_company) : "")
    queryString += (type != null ? (" AND type="+type) : "")
    queryString += " ORDER BY type"
    queryString += ((request.body.limit == null && request.body.page == null) ? "" : (" LIMIT "+limit+" OFFSET "+page))

    db.pool.query(queryString, (error, results) => {
        baseError.handleError(error, response)
        
        db.pool.query("SELECT COUNT(id) as total FROM m_location WHERE id_company = ? AND flag = 1 AND type = ?", [id_company, type],(error, resultTotal) => {
            baseError.handleError(error, response)

            let data = {
                total_data: resultTotal[0].total,
                locations: results
            }
            response.send({
                code: statusCode.success,
                message: "Lokasi ditemukan",
                data: data
            });
        })
    })
}

exports.getLocationById = (request, response) => {
    const id = request.body.id_location

    let queryString = "SELECT * FROM m_location WHERE id = ? AND flag = 1"
    db.pool.query(queryString, [id], (error, results) => {
        baseError.handleError(error, response)

        if (results.length == 0) {
            return response.send({
                code: statusCode.empty_data,
                message: "Lokasi tidak ditemukan"
            });
        }

        response.send({
            code: statusCode.success,
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
    const updater_id = request.user_id
    const type = request.body.type
    const date = new Date()

    var queryString = "UPDATE m_location SET updated_at = '"+date+"', updater_id = "+updater_id
    queryString += (name != null ? (", name = '"+name+"'") : "")
    queryString += (email != null ? (", email = '"+email+"'") : "")
    queryString += (phone != null ? (", phone = '"+phone+"'") : "")
    queryString += (lat != null ? (", lat = "+lat) : "")
    queryString += (lng != null ? (", lng = "+lng) : "")
    queryString += (address != null ? (", address = '"+address+"'") : "")
    queryString += (type != null ? (", type = '"+type+"'") : "")
    queryString += " WHERE id = "+id
    
    db.pool.query(query, (error, results) => {
        baseError.handleError(error, response)

        response.send({
            code: statusCode.success,
            message: "Berhasil Edit Lokasi"
        });
    })
}

exports.deleteLocation = (request, response) => {
    const updater_id = request.user_id
    const id = request.body.id_location
    
    let queryString = "UPDATE m_location SET updater_id = ?, updated_at = ?, flag = 0 WHERE id = ?"
    db.pool.query(queryString, [updater_id, new Date(), id], (error, results) => {
        baseError.handleError(error, response)
        
        response.send({
            code: statusCode.success,
            message: "Berhasil Hapus Lokasi"
        });
    })
}
