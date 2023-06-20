const db = require('../config/dbConfig.js');

exports.addCustomer = (request, response) => {
    //Data User
    const userId = request.userId
    const id_company = request.body.id_company
    const name = request.body.name
    const email = request.body.email
    const phone = request.body.phone
    const lat = request.body.lat
    const lng = request.body.lng
    const address = request.body.address

    db.pool.query('INSERT INTO m_customer (id_company, name, email, phone, lat, lng, address, creator_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [id_company, name, email, phone, lat, lng, address, userId], (error, results) => {
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
            message: "Pendaftaran data pelanggan Berhasil"
        });
    })
}

exports.getCustomers = (request, response) => {
    const id_company = request.body.id_company

    db.pool.query('SELECT * FROM m_customer WHERE id_company = ? AND flag = 1', [id_company], (error, results) => {
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
            message: "Berhasil mengambil data semua pelanggan",
            data: results
        });
    })
}

exports.editCustomer = (request, response) => {
    const id_customer = request.body.id_customer
    const name = request.body.name
    const email = request.body.email
    const phone = request.body.phone
    const lat = request.body.lat
    const lng = request.body.lng
    const address = request.body.address
    const updater_id = request.userId

    db.pool.query('UPDATE m_customer SET name = ?, email = ?, phone = ?, lat = ?, lng = ?, address = ?, updater_id = ?, updated_at = ? WHERE id = ?', 
        [name, email, phone, lat, lng, address, updater_id, new Date(), id_customer], (error, results) => {
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
            message: "Pelanggan Berhasil Diedit"
        });
    })
}

exports.deleteCustomer = (request, response) => {
    const id_customer = request.body.id_customer
    const updater_id = request.userId
    
    db.pool.query('UPDATE m_customer SET updater_id = ?, updated_at = ?, flag = 0 WHERE id = ?', [updater_id, new Date(), id_customer], (error, results) => {
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
            message: "Pelanggan Berhasil Dihapus"
        });
    })
}
