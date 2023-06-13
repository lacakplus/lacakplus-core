const db = require('../config/dbConfig.js');

exports.getRoles = (request, response) => {
    db.pool.query('SELECT * FROM m_role', (error, results) => {
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
            message: "Data role ditemukan",
            data: results
        });
    })
}