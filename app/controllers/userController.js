const db = require('../config/dbConfig.js');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const authConfig = require("../config/authConfig.js");

exports.login = (request, response) => {
    const username = request.body.username
    const password = request.body.password
    const platform = request.body.platform
    const version = request.body.version
    const fcm = request.body.fcm

    db.pool.query('SELECT * FROM m_user WHERE username = ?', [username], (error, results) => {
        if (error) {
            response.json({
                code: 400,
                message: error.message,
                error: error
            });
            return
        }
        if (results.length == 0 || results[0].flag == 0) {
            response.json({
                code: 401,
                message: "Akun tidak ditemukan"
            });
            return
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
            db.pool.query('UPDATE m_user SET token = ?, platform = ?, version = ?, fcm = ? WHERE id = ?', [token, platform, version, fcm, results[0].id], (error, results) => {
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
                    message: "Berhasil Login",
                    data: dataUser
                });
            })
        } else {
            response.status(501).json({
                code: 501,
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

    db.pool.query('SELECT * FROM m_user WHERE email = ? OR username = ?', [email, username], (error, results) => {
        if (error) {
            response.json({
                code: 400,
                message: error.message,
                error: error
            });
            return
        }
        if (results.length != 0) {
            response.json({
                code: 401,
                message: "Email atau nama pengguna sudah pernah digunakan"
            });
            return
        }
        db.pool.query('INSERT INTO m_company (name, phone, email, no_id, lat, lng, address) VALUES (?, ?, ?, ?, ?, ?, ?)', [company_name, company_phone, company_email, company_no_id, lat, lng, address], (error, results) => {
            if (error) {
                response.json({
                    code: 400,
                    message: error.message,
                    error: error
                });
                return
            }
            const id_company = results.insertId
            db.pool.query('INSERT INTO m_user (id_company, id_role, name, no_id, email, username, password, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [id_company, id_role, name, no_id, email, username, password, phone], (error, results) => {
                if (error) {
                    response.json({
                        code: 400,
                        message: error.message,
                        error: error
                    });
                    return
                }
                let data = {
                    id_company: id_company,
                    id_user: results.insertId
                }
                response.json({
                    code: 200,
                    message: "Selamat Anda Berhasil Daftar Akun!",
                    data: data
                });
            })
        })        
    })
}

exports.getUserById = (request, response) => {
    const id = request.body.id_user

    var query = "SELECT u.*, r.id AS id_role, r.name AS name_role FROM m_user u "+
        "JOIN m_role r ON u.id_role=r.id AND r.flag = 1 "+
        "WHERE u.flag = 1 AND u.id = ?"

    db.pool.query(query, [id], (error, results) => {
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
                message: "Data pengguna tidak ditemukan"
            });
            return
        }
        response.json({
            code: 200,
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

    var page = 0
    if (request.body.page > 0) {
        page = (request.body.page - 1) * limit
    }

    var query = "SELECT u.id, u.name, u.phone, r.name AS name_role FROM m_user u "+
        "JOIN m_role r ON u.id_role=r.id AND r.flag = 1 "+
        "WHERE u.flag = 1"

    query += (search != null? (" AND u.name like '%"+ search +"%'") : "")
    query += (id_company != null? (" AND u.id_company="+id_company) : "")
    query += (id_role != null? (" AND u.id_role="+id_role) : "")
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
            message: "Data pengguna ditemukan",
            data: results
        });
    })
}

exports.addUser = (request, response) => {
    //Data User
    const userId = request.userId
    const id_role = request.body.id_role
    const id_company = request.body.id_company
    const name = request.body.name
    const no_id = request.body.no_id
    const email = request.body.email
    const username = request.body.username
    const password = bcrypt.hashSync(request.body.password, 8)
    const phone = request.body.phone

    db.pool.query('SELECT * FROM m_user WHERE username = ?', [username], (error, results) => {
        if (error) {
            response.json({
                code: 400,
                message: error.message,
                error: error
            });
            return
        }
        if (results.length != 0) {
            response.json({
                code: 401,
                message: "Nama pengguna sudah pernah digunakan"
            });
            return
        }

        db.pool.query('INSERT INTO m_user (id_company, id_role, name, no_id, email, username, password, phone, creator_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [id_company, id_role, name, no_id, email, username, password, phone, userId], (error, results) => {
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
                message: "Berhasil mendaftaran akun"
            });
        })
    })
}

exports.editUser = (request, response) => {
    //Data User
    const userId = request.userId
    const id_user = request.body.id_user
    const id_role = request.body.id_role
    const name = request.body.name
    const no_id = request.body.no_id
    const email = request.body.email
    const password = bcrypt.hashSync(request.body.password, 8)
    const phone = request.body.phone
    let date = new Date();

    db.pool.query('UPDATE m_user SET id_role = ?, name = ?, no_id = ?, email = ?, password = ?, phone = ?, updater_id = ?, updated_at = ? WHERE id = ?', [id_role, name, no_id, email, password, phone, userId, date, id_user], (error, results) => {
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
            message: "Berhasil edit data pengguna"
        });
    })
}

exports.deleteUser = (request, response) => {
    //Data User
    const id_user = request.body.id_user
    const userId = request.userId
    let date = new Date();

    db.pool.query('UPDATE m_user SET flag = 0, updater_id = ?, updated_at = ? WHERE id = ?', [userId, date, id_user], (error, results) => {
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
            message: "Berhasil menghapus data pengguna"
        });
    })
}



  