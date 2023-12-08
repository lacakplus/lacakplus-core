const db = require('../config/dbConfig.js');
const statusCode = require('../config/statusCode.js');
const baseError = require("../middleware/error.js");

exports.getRoles = (request, response) => {
    let queryString = "SELECT * FROM m_role"
    db.pool.query(queryString, (error, results) => {
        baseError.handleError(error, response)
        
        response.status(statusCode.success).send({
            code: statusCode.success,
            message: "Role ditemukan",
            data: results
        });
    })
}