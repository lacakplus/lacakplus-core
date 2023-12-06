const db = require('../config/dbConfig.js');

exports.getCompanies = (request, response) => {
    db.pool.query('SELECT * FROM m_company WHERE flag = 1', (error, results) => {
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
                message: "Company tidak ditemukan"
            });
            return
        }
        response.json({
            code: 200,
            message: "Company ditemukan",
            data: results
        });
    })
}

exports.getCompanyById = (request, response) => {
    const id = request.body.id_company
    db.pool.query('SELECT * FROM m_company WHERE id = ? AND flag = 1', [id], (error, results) => {
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
                message: "Company tidak ditemukan"
            });
            return
        }
        response.json({
            code: 200,
            message: "Company ditemukan",
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

    db.pool.query('UPDATE m_company SET name = ?, phone = ?, email = ?, no_id = ?, lat = ?, lng = ?, address = ?, updater_id = ?, updated_at = ? WHERE id = ? AND flag = 1', 
        [name, phone, email, no_id, lat, lng, address, updater_id, new Date(), id_company], (error, results) => {
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
            message: "Berhasil edit Company"
        });
    })
}

exports.deleteCompany = (request, response) => {
    const id_company = request.body.id_company
    const updater_id = request.user_id
    
    db.pool.query('UPDATE m_company SET updater_id = ?, updated_at = ?, flag = 0 WHERE id = ?', [updater_id, new Date(), id_company], (error, results) => {
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
            message: "Berhasil hapus Company"
        });
    })
}