const db = require('../config/dbConfig.js');
const statusCode = require('../config/statusCode.js');
const baseError = require("../middleware/error.js");

exports.getVehicleById = (request, response) => {
    const id = request.body.id_vehicle

    let queryString = "SELECT * FROM m_vehicle WHERE id = ? AND flag = 1"
    db.pool.query(queryString, [id], (error, results) => {
        baseError.handleError(error, response)

        if (results.length == 0) {
            return response.status(statusCode.empty_data).send({
                code: statusCode.empty_data,
                message: "Kendaraan tidak ditemukan"
            });
        }
        response.status(statusCode.success).send({
            code: statusCode.success,
            message: "Kendaraan ditemukan",
            data: results[0]
        });
    })
}

exports.getVehicles = (request, response) => {
    const id_company = request.body.id_company
    const search = request.body.search
    const limit = request.body.limit || 10
 
    let page = (request.body.page > 0) ? (request.body.page - 1) * limit : 0

    var queryString = "SELECT id, name, no_plate, type, kilometers FROM m_vehicle WHERE flag = 1"

    queryString += (search != null? (" AND (name like '%"+ search +"%' OR no_plate like '%"+ search +"%' OR type like '%"+ search +"%')") : "")
    queryString += (id_company != null? (" AND id_company="+id_company) : "")
    queryString += ((request.body.limit == null && request.body.page == null)? "" : (" LIMIT "+limit+" OFFSET "+page)) 

    db.pool.query(queryString, [id_company, limit, page], (error, results) => {
        baseError.handleError(error, response)

        db.pool.query("SELECT COUNT(id) as total FROM m_vehicle WHERE id_company = ? AND flag = 1", [id_company],(error, resultTotal) => {
        baseError.handleError(error, response)

            let data = {
                total_data: resultTotal[0].total,
                vehicles: results
            }
            response.status(statusCode.success).send({
                code: statusCode.success,
                message: "Kendaraan ditemukan",
                data: data
            });
        })
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
    const creator_id = request.user_id

    let queryString = "SELECT * FROM m_vehicle WHERE no_plate = ? AND flag = 1 AND id_company = ?"
    db.pool.query(queryString, [no_plate, id_company], (error, results) => {
        baseError.handleError(error, response)

        if (results.length != 0) {
            return response.status(statusCode.data_already_use).send({
                code: statusCode.data_already_use,
                message: "Plat nomor sudah pernah digunakan"
            });
        }
        db.pool.query("INSERT INTO m_vehicle (id_company, no_plate, name, brand, type, bought_year, kilometers, creator_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [id_company, no_plate, name, brand, type, bought_year, kilometers, creator_id], (error, results) => {
            baseError.handleError(error, response)
            
            response.status(statusCode.success).send({
                code: statusCode.success,
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
    const updater_id = request.user_id
    const date = new Date()

    let queryString = "SELECT * FROM m_vehicle WHERE no_plate = ? AND id_company = ? AND flag = 1 AND id <> ?"
    db.pool.query(queryString, [no_plate, id_company, id_vehicle], (error, results) => {
        baseError.handleError(error, response)

        if (results.length != 0) {
            return response.status(statusCode.data_already_use).send({
                code: statusCode.data_already_use,
                message: "Plat nomor sudah pernah digunakan"
            });
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
            baseError.handleError(error, response)
            
            response.status(statusCode.success).send({
                code: statusCode.success,
                message: "Berhasil edit Kendaraan"
            });
        })
    })
}

exports.deleteVehicle = (request, response) => {
    const id_vehicle = request.body.id_vehicle
    const updater_id = request.user_id
    
    let queryString = "UPDATE m_vehicle SET updater_id = ?, updated_at = ?, flag = 0 WHERE id = ?"
    db.pool.query(queryString, [updater_id, new Date(), id_vehicle], (error, results) => {
        baseError.handleError(error, response)

        response.status(statusCode.success).send({
            code: statusCode.success,
            message: "Berhasil hapus Kendaraan"
        });
    })
}
