const db = require('../config/dbConfig.js');
const statusCode = require('../config/statusCode.js');
const baseError = require("../middleware/error.js");

exports.getCompanies = (request, response) => {
    const queryString = "SELECT * FROM m_company WHERE flag = 1"
    db.pool.query(queryString, (error, results) => {
        baseError.handleError(error, response)

        if (results.length == 0) {
            return response.status(statusCode.empty_data).send({
                code: statusCode.empty_data,
                message: "Perusahaan tidak ditemukan"
            });
        }

        response.status(statusCode.success).send({
            code: statusCode.success,
            message: "Perusahaan ditemukan",
            data: results
        });
    })
}

exports.getCompanyById = (request, response) => {
    const id = request.body.id_company

    const queryString = "SELECT * FROM m_company WHERE id = ? AND flag = 1"
    db.pool.query(queryString, [id], (error, results) => {
        baseError.handleError(error, response)

        if (results.length == 0) {
            return response.status(statusCode.empty_data).send({
                code: statusCode.empty_data,
                message: "Perusahaan tidak ditemukan"
            });
        }
        response.json({
            code: 200,
            message: "Perusahaan ditemukan",
            data: results
        });
    })
}

exports.editCompany = (request, response) => {
    const id_company = request.body.id_company
    const name = request.body.name
    const phone = request.body.phone
    const email = request.body.email
    const no_id = request.body.no_id
    const lat = request.body.lat
    const lng = request.body.lng
    const address = request.body.address
    const updater_id = request.user_id

    const queryString = "UPDATE m_company SET name = ?, phone = ?, email = ?, no_id = ?, lat = ?, lng = ?, address = ?, updater_id = ?, updated_at = ? WHERE id = ? AND flag = 1"
    db.pool.query(queryString, [name, phone, email, no_id, lat, lng, address, updater_id, new Date(), id_company], (error, results) => {
        baseError.handleError(error, response)

        response.json({
            code: 200,
            message: "Berhasil Edit Perusahaan"
        });
    })
}

exports.deleteCompany = (request, response) => {
    const id_company = request.body.id_company
    const updater_id = request.user_id

    const queryString = "UPDATE m_company SET updater_id = ?, updated_at = ?, flag = 0 WHERE id = ?"
    db.pool.query(queryString, [updater_id, new Date(), id_company], (error, results) => {
        baseError.handleError(error, response)

        response.json({
            code: 200,
            message: "Berhasil Hapus Perusahaan"
        });
    })
}