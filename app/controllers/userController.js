const db = require('../config/dbConfig.js');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const authConfig = require("../config/authConfig.js");

exports.login = (request, response) => {
    const username = request.body.username
    const password = request.body.password
    db.pool.query('SELECT * FROM m_user WHERE username = ?', [username], (error, results) => {
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
            db.pool.query('UPDATE m_user SET token = ? WHERE id = ?', [token, results[0].id], (error, results) => {
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
                    message: "Login Berhasil",
                    data: results[0],
                    session: token
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
    const id_company = request.body.id_company
    const id_role = request.body.id_role
    const name = request.body.name
    const no_id = request.body.no_id
    const email = request.body.email
    const username = request.body.username
    const password = bcrypt.hashSync(request.body.password, 8)
    const phone = request.body.phone
    db.pool.query('SELECT * FROM m_user WHERE email = ?', [email], (error, results) => {
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
                message: "Email sudah pernah digunakan"
            });
            return
        }
        db.pool.query('INSERT INTO m_user (id_company, id_role, name, no_id, email, username, password, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [id_company, id_role, name, no_id, email, username, password, phone], (error, results) => {
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
                message: "Pendaftaran Berhasil",
                data: results[0]
            });
        })
    })
}

exports.getUserById = (request, response) => {
    const loginId = request.userId
    db.pool.query('SELECT * FROM m_user WHERE id = ?', [loginId], (error, results) => {
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
                message: "User tidak ditemukan dengan id : " + loginId
            });
            return
        }
        response.json({
            code: 200,
            message: "Detail user ditemukan dengan id : "+ results[0].id +" dan nama : " + results[0].name,
            data: results[0]
        });
    })
}

// exports.getUsers = (request, response) => {
//     db.pool.query('SELECT * FROM user_apps', (error, results) => {
//         if (error) {
//             response.json({
//                 code: 400,
//                 message: error.message,
//                 error: error
//             });
//             return
//         }
//         response.json({
//             code: 200,
//             message: "Berhasil mengambil data semua user",
//             data: results
//         });
//     })
// }

// exports.updateProfile = (request, response) => {
//     const id = parseInt(request.body.id)
//     const name = request.body.name
//     const email = request.body.email
//     const password = request.body.password
//     db.pool.query('UPDATE user_apps SET name = ?, email = ?, password = ? WHERE id = ?', [name, email, password, id], (error, results) => {
//         if (error) {
//             response.json({
//                 code: 400,
//                 message: error.message,
//                 error: error
//             });
//             return
//         }
//         response.json({
//             code: 200,
//             message: "Update profile Berhasil",
//             data: results
//         });
//     })
// }

// exports.deleteUser = (request, response) => {
//     const id = parseInt(request.body.id)
//     db.pool.query('SELECT * FROM user_apps WHERE id = ?', [id], (error, results) => {
//         if (error) {
//             response.json({
//                 code: 400,
//                 message: error.message,
//                 error: error
//             });
//             return
//         }
//         if (results.length == 0) {
//             response.json({
//                 code: 401,
//                 message: "User tidak ditemukan"
//             });
//             return
//         }
//         db.pool.query('DELETE FROM user_apps WHERE id = ?', [id], (error, results) => {
//             if (error) {
//                 response.json({
//                     code: 400,
//                     message: error.message,
//                     error: error
//                 });
//                 return
//             }
//             response.json({
//                 code: 200,
//                 message: "Berhasil menghapus data user dengan id : "+ id
//             });
//         })
//     })
// }



  