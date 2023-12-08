const db = require('../config/dbConfig.js');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const authConfig = require("../config/authConfig.js");
const statusCode = require('../config/statusCode.js');
const baseError = require("../middleware/error.js");

exports.login = (request, response) => {
    const username = request.body.username
    const password = request.body.password
    const platform = request.body.platform
    const version = request.body.version
    const fcm = request.body.fcm

    let queryString = "SELECT * FROM m_user WHERE username = ?"
    db.pool.query(queryString, [username], (error, results) => {
        baseError.handleError(error, response)
        
        if (results.length == 0 || results[0].flag == 0) {
            return response.status(statusCode.empty_data).send({
                code: statusCode.empty_data,
                message: "Akun tidak ditemukan"
            });
        }
        var passwordIsValid = bcrypt.compareSync(
            password,
            results[0].password
        );
        if (passwordIsValid) {
            var token = jwt.sign({ id: results[0].id }, authConfig.secret, {
                expiresIn: 31536000 // 1 year
            });
            var dataUser = results[0]
            dataUser.token = token
            dataUser.platform = platform
            dataUser.version = version
            dataUser.fcm = fcm
            db.pool.query("UPDATE m_user SET token = ?, platform = ?, version = ?, fcm = ? WHERE id = ?", [token, platform, version, fcm, results[0].id], (error, results) => {
                baseError.handleError(error, response)
                
                response.status(statusCode.success).send({
                    code: statusCode.success,
                    message: "Berhasil Login",
                    data: dataUser
                });
            })
        } else {
            response.status(statusCode.wrong_password).send({
                code: statusCode.wrong_password,
                message: "Kata sandi salah"
            });
        }
    })
}

exports.register = (request, response) => {
    //Data Company
    const company_name = request.body.company_name
    const company_phone = request.body.company_phone
    const company_email = request.body.company_email
    const company_no_id = request.body.company_no_id
    const lat = request.body.lat
    const lng = request.body.lng
    const address = request.body.address

    //Data User
    const id_role = request.body.id_role
    const name = request.body.name
    const no_id = request.body.no_id
    const email = request.body.email
    const username = request.body.username
    const password = bcrypt.hashSync(request.body.password, 8)
    const phone = request.body.phone

    let queryString = "SELECT * FROM m_user WHERE email = ? OR username = ?"
    db.pool.query(queryString, [email, username], (error, results) => {
        baseError.handleError(error, response)
        
        if (results.length != 0) {
            return response.status(statusCode.data_already_use).send({
                code: statusCode.data_already_use,
                message: "Email atau nama pengguna sudah pernah digunakan"
            });
            return
        }
        db.pool.query("INSERT INTO m_company (name, phone, email, no_id, lat, lng, address) VALUES (?, ?, ?, ?, ?, ?, ?)", [company_name, company_phone, company_email, company_no_id, lat, lng, address], (error, results) => {
            baseError.handleError(error, response)

            const id_company = results.insertId
            db.pool.query("INSERT INTO m_user (id_company, id_role, name, no_id, email, username, password, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [id_company, id_role, name, no_id, email, username, password, phone], (error, results) => {
                baseError.handleError(error, response)

                let data = {
                    id_company: id_company,
                    id_user: results.insertId
                }
                response.status(statusCode.success).send({
                    code: statusCode.success,
                    message: "Selamat Anda Berhasil Daftar Akun!",
                    data: data
                });
            })
        })        
    })
}

exports.getUserById = (request, response) => {
    const id = request.body.id_user

    let queryString = "SELECT u.*, r.name AS name_role FROM m_user u "+
        "JOIN m_role r ON u.id_role=r.id AND r.flag = 1 "+
        "WHERE u.flag = 1 AND u.id = ?"

    db.pool.query(queryString, [id], (error, results) => {
        baseError.handleError(error, response)

        if (results.length == 0) {
            return response.status(statusCode.empty_data).send({
                code: statusCode.empty_data,
                message: "Data pengguna tidak ditemukan"
            });
        }
        response.status(statusCode.success).send({
            code: statusCode.success,
            message: "Data pengguna ditemukan",
            data: results[0]
        });
    })
}

exports.getUsers = (request, response) => {
    const id_company = request.body.id_company
    const id_role = request.body.id_role
    const search = request.body.search
    const limit = request.body.limit || 10

    let page = (request.body.page > 0) ? (request.body.page - 1) * limit : 0

    var queryString = "SELECT u.id, u.name, u.phone, r.name AS name_role FROM m_user u "+
        "JOIN m_role r ON u.id_role=r.id AND r.flag = 1 "+
        "WHERE u.flag = 1"

    queryString += (search != null? (" AND u.name like '%"+ search +"%'") : "")
    queryString += (id_company != null? (" AND u.id_company="+id_company) : "")
    queryString += (id_role != null? (" AND u.id_role="+id_role) : "")
    queryString += ((request.body.limit == null && request.body.page == null)? "" : (" LIMIT "+limit+" OFFSET "+page))    

    db.pool.query(queryString, (error, results) => {
        baseError.handleError(error, response)

        db.pool.query("SELECT COUNT(id) as total FROM m_user WHERE id_company = ? AND  flag = 1", [id_company],(error, resultTotal) => {
            baseError.handleError(error, response)

            let data = {
                total_data: resultTotal[0].total,
                users: results
            }
            response.status(statusCode.success).send({
                code: statusCode.success,
                message: "Data pengguna ditemukan",
                data: data
            });
        })
    })
}

exports.addUser = (request, response) => {
    //Data User
    const user_id = request.user_id
    const id_role = request.body.id_role
    const id_company = request.body.id_company
    const name = request.body.name
    const no_id = request.body.no_id
    const email = request.body.email
    const username = request.body.username
    const password = bcrypt.hashSync(request.body.password, 8)
    const phone = request.body.phone

    let queryString = "SELECT * FROM m_user WHERE username = ?"
    db.pool.query(queryString, [username], (error, results) => {
        baseError.handleError(error, response)

        if (results.length != 0) {
            return response.status(statusCode.data_already_use).send({
                code: statusCode.data_already_use,
                message: "Nama pengguna sudah pernah digunakan"
            });
        }

        db.pool.query("INSERT INTO m_user (id_company, id_role, name, no_id, email, username, password, phone, creator_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [id_company, id_role, name, no_id, email, username, password, phone, user_id], (error, results) => {
            baseError.handleError(error, response)
            
            response.status(statusCode.success).send({
                code: statusCode.success,
                message: "Berhasil mendaftaran akun"
            });
        })
    })
}

exports.editUser = (request, response) => {
    //Data User
    const user_id = request.user_id
    const id_company = request.body.id_company
    const id_user = request.body.id_user
    const id_role = request.body.id_role
    const name = request.body.name
    const username = request.body.username
    const no_id = request.body.no_id
    const email = request.body.email
    const password = request.body.password
    const phone = request.body.phone
    let date = new Date();

    let queryString = "SELECT * FROM m_user WHERE username = ? AND id_company = ? AND flag = 1 AND id <> ?"
    db.pool.query(queryString, [username, id_company, id_user], (error, results) => {
        baseError.handleError(error, response)

        if (results.length != 0) {
            return response.status(statusCode.data_already_use).send({
                code: statusCode.data_already_use,
                message: "Nama pengguna sudah pernah digunakan"
            });
        }

        var query = "UPDATE m_user SET updated_at = '"+date+"', updater_id = "+user_id

        query += (id_role != null? (", id_role = "+id_role) : "")
        query += (name != null? (", name = '"+name+"'") : "")
        query += (username != null? (", username = '"+username+"'") : "")
        query += (no_id != null? (", no_id = '"+no_id+"'") : "")
        query += (email != null? (", email = '"+email+"'") : "")
        query += (password != null? (", password = '"+bcrypt.hashSync(password, 8)+"'") : "")
        query += (phone != null? (", phone = '"+phone+"'") : "")

        query += " WHERE id = "+id_user

        db.pool.query(query, (error, results) => {
            baseError.handleError(error, response)
            
            response.status(statusCode.success).send({
                code: statusCode.success,
                message: "Berhasil edit data pengguna"
            });
        })
    })
}

exports.deleteUser = (request, response) => {
    //Data User
    const id_user = request.body.id_user
    const user_id = request.user_id
    let date = new Date();

    let queryString = "UPDATE m_user SET flag = 0, updater_id = ?, updated_at = ? WHERE id = ?"
    db.pool.query(queryString, [user_id, date, id_user], (error, results) => {
        baseError.handleError(error, response)

        response.status(statusCode.success).send({
            code: statusCode.success,
            message: "Berhasil menghapus data pengguna"
        });
    })
}



  