const db = require('../config/dbConfig.js');
const statusCode = require('../config/statusCode.js');
const baseError = require("../middleware/error.js");

exports.addTravel = (request, response) => {
    //Data Travel
    const id_company = request.body.id_company
    const id_vehicle = request.body.id_vehicle
    const id_driver = request.body.id_driver
    const depart_plan_at = request.body.depart_plan_at
    const arrive_plan_at = request.body.arrive_plan_at
    const user_id = request.user_id

    //Data Travel Dtl
    const travel_dtl = request.body.travel_dtl
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = ("" + date_ob.getFullYear()).slice(-2);

    let queryString = "INSERT INTO tr_travel (id_company, id_vehicle, id_driver, depart_plan_at, arrive_plan_at, creator_id) VALUES (?, ?, ?, ?, ?, ?)"
    db.pool.query(queryString, [id_company, id_vehicle, id_driver, depart_plan_at, arrive_plan_at, user_id], (error, results) => {
        baseError.handleError(error, response)

        const id_travel = results.insertId
        let travelNumber = year + month + date + "-" + id_company + "-" + id_travel
        db.pool.query("UPDATE tr_travel SET travel_number = ? WHERE id = ?", [travelNumber, id_travel], (error, results) => {
            baseError.handleError(error, response)

            let values = [];
            for (let i = 0; i < travel_dtl.length; i++) {
                values.push([id_travel, travel_dtl[i].sequence, travel_dtl[i].id_location, user_id])
            }
            db.pool.query("INSERT INTO tr_travel_dtl (id_travel, sequence, id_location, creator_id) VALUES ?", [values], (error, results) => {
                baseError.handleError(error, response)

                response.status(statusCode.success).send({
                    code: statusCode.success,
                    message: "Berhasil buat Perjalanan",
                    data: results
                });
            })
        })
    })
}

exports.editTravel = (request, response) => {
    //Data Travel
    const id_travel = request.body.id_travel
    const id_vehicle = request.body.id_vehicle
    const id_driver = request.body.id_driver
    const depart_plan_at = request.body.depart_plan_at
    const arrive_plan_at = request.body.arrive_plan_at
    const user_id = request.user_id

    //Data Travel Dtl
    const travel_dtl = request.body.travel_dtl

    let queryString = "UPDATE tr_travel SET id_vehicle = ?, id_driver = ?, depart_plan_at = ?, arrive_plan_at = ?, updater_id = ? WHERE id_travel = ?"
    db.pool.query(queryString, [id_vehicle, id_driver, depart_plan_at, arrive_plan_at, user_id, id_travel], (error, results) => {
        baseError.handleError(error, response)

        db.pool.query("DELETE FROM tr_travel_dtl WHERE id_travel = ?", [id_travel], (error, results) => {
            baseError.handleError(error, response)

            let values = [];
            for (let i = 0; i < travel_dtl.length; i++) {
                values.push([id_travel, travel_dtl[i].sequence, travel_dtl[i].id_location, user_id, user_id])
            }
            db.pool.query("INSERT INTO tr_travel_dtl (id_travel, sequence, id_location, creator_id, updater_id) VALUES ?", [values], (error, results) => {
                baseError.handleError(error, response)
                
                response.status(statusCode.success).send({
                    code: statusCode.success,
                    message: "Berhasil edit Perjalanan",
                    data: results
                });
            })
        })
    })
}

exports.getTravels = (request, response) => {
    const id_user = request.user_id
    const id_role = request.body.id_role
    const status = request.body.status
    const id_company = request.body.id_company
    const search = request.body.search
    const limit = request.body.limit || 10
    
    let page = (request.body.page > 0) ? (request.body.page - 1) * limit : 0

    var queryString = "SELECT t.id, t.travel_number, t.id_company, t.depart_plan_at, t.depart_at, t.arrive_plan_at, t.arrive_at, t.status, t.created_at, u.name AS name_driver, v.name AS name_vehicle, v.no_plate FROM tr_travel t "+
        "JOIN m_user u ON t.id_driver = u.id AND u.flag = 1 "+
        "JOIN m_vehicle v ON t.id_vehicle = v.id AND v.flag = 1 "+
        "WHERE t.flag = 1"

    queryString += (search != null? (" AND (t.travel_number like '%"+ search +"%' OR u.name '%"+ search +"%' OR v.name like '%"+ search +"%' OR v.no_plate like '%"+ search +"%')") : "")
    queryString += (id_company != null? (" AND t.id_company="+id_company) : "")
    queryString += (status != null? (" AND t.status="+status) : "")
    queryString += (id_role == 5? (" AND t.id_driver="+id_user) : "")
    queryString += " ORDER BY t.created_at DESC"

    queryString += ((request.body.limit == null && request.body.page == null)? "" : (" LIMIT "+limit+" OFFSET "+page)) 

    db.pool.query(queryString, (error, results) => {
        baseError.handleError(error, response)
        
        response.status(statusCode.success).send({
            code: statusCode.success,
            message: "Data perjalanan ditemukan",
            data: results
        });
    })
}

exports.getTravelById = (request, response) => {
    const id_travel = request.body.id_travel

    let queryString = "SELECT t.id, t.travel_number, t.id_company, t.depart_plan_at, t.depart_at, t.arrive_plan_at, t.arrive_at, t.status, t.created_at, u.name AS name_driver, v.name AS name_vehicle, v.no_plate FROM tr_travel t "+
        "JOIN m_user u ON t.id_driver = u.id AND u.flag = 1 "+
        "JOIN m_vehicle v ON t.id_vehicle = v.id AND v.flag = 1 "+
        "WHERE t.id = ? AND t.flag = 1"

    db.pool.query(queryString, [id_travel],(error, results) => {
        baseError.handleError(error, response)

        if (results.length == 0) {
            return response.status(statusCode.empty_data).send({
                code: statusCode.empty_data,
                message: "Perjalanan tidak ditemukan"
            });
        }
        
        response.status(statusCode.success).send({
            code: statusCode.success,
            message: "Perjalanan ditemukan",
            data: results[0]
        });
    })
}

exports.getTravelDetails = (request, response) => {
    const id_travel = request.body.id_travel
    let queryString = "SELECT td.id, td.id_travel, td.sequence, td.id_location, td.arrive_at, td.depart_at, td.status, td.created_at, l.name AS name_location, l.lat, l.lng, l.address, l.phone FROM tr_travel_dtl td "+
        "JOIN m_location l ON td.id_location = l.id AND l.flag = 1 "+
        "WHERE td.id_travel = ? AND td.flag = 1"

    db.pool.query(queryString, [id_travel], (error, results) => {
        baseError.handleError(error, response)

        if (results.length == 0) {
            return response.status(statusCode.empty_data).send({
                code: statusCode.empty_data,
                message: "Data perjalanan detail tidak ditemukan"
            });
        }

        response.status(statusCode.success).send({
            code: statusCode.success,
            message: "Data perjalanan detail ditemukan",
            data: results
        });
    })
}

exports.editTravelDetails = (request, response) => {
    //Data Travel
    const id_travel = request.body.id_travel
    const status = request.body.status
    const depart_at = request.body.depart_at
    const arrive_at = request.body.arrive_at
    const user_id = request.user_id

    //Data Travel Dtl
    const travel_dtl = request.body.travel_dtl

    let queryString = "UPDATE tr_travel SET status = ?, depart_at = ?, arrive_at = ? WHERE id = ?"
    db.pool.query(queryString, [status, depart_at, arrive_at, id_travel], (error, results) => {
        baseError.handleError(error, response)

        let queryStatus = ""
        let queryArrive = ""
        let queryDepart = ""
        let listId = ""
        const date = new Date()

        for (let i = 0; i < travel_dtl.length; i++) {
            queryStatus += (travel_dtl[i].status != null)? (" WHEN id = "+travel_dtl[i].id_travel_dtl+" THEN "+travel_dtl[i].status) : ""
            queryArrive += (travel_dtl[i].arrive_at != null)? (" WHEN id = "+travel_dtl[i].id_travel_dtl+" THEN '"+travel_dtl[i].arrive_at+"'") : ""
            queryDepart += (travel_dtl[i].depart_at != null)? (" WHEN id = "+travel_dtl[i].id_travel_dtl+" THEN '"+travel_dtl[i].depart_at+"'") : ""
            listId += ((listId == "")? travel_dtl[i].id_travel_dtl : (", "+travel_dtl[i].id_travel_dtl))
        }

        let query = "UPDATE tr_travel_dtl"+
            " SET status = (CASE "+queryStatus+" END), arrive_at = (CASE "+queryArrive+" END), depart_at = (CASE "+queryDepart+" END), "+
            " updated_at = '"+date+"', updater_id = "+user_id+
            " WHERE id IN ("+listId+")"

        db.pool.query(query, (error, results) => {
            baseError.handleError(error, response)
            
            response.status(statusCode.success).send({
                code: statusCode.success,
                message: "Berhasil edit Perjalanan",
                data: results
            });
        })
    })
}

exports.activeTravel = (request, response) => {
    const user_id = request.user_id
    const id_travel = request.body.id_travel
    const id_travel_dtl = request.body.id_travel_dtl
    let date = new Date();

    db.pool.query("UPDATE tr_travel SET status = 1, updater_id = ?, updated_at = ? WHERE id = ?", [user_id, date, id_travel], (error, results) => {
        baseError.handleError(error, response)

        db.pool.query("UPDATE tr_travel_dtl SET status = 1, updater_id = ?, updated_at = ? WHERE id = ?", [user_id, date, id_travel_dtl], (error, results) => {
            baseError.handleError(error, response)
            
            response.status(statusCode.success).send({
                code: statusCode.success,
                message: "Berhasil aktifkan status perjalanan"
            });
        })
    })
}

exports.travelStart = (request, response) => {
    //Data User
    const user_id = request.user_id
    const id_travel = request.body.id_travel
    const id_travel_dtl_now = request.body.id_travel_dtl_now
    const id_travel_dtl_next = request.body.id_travel_dtl_next
    const depart_at = request.body.depart_at
    let date = new Date();

    db.pool.query("UPDATE tr_travel SET status = 2, updater_id = ?, updated_at = ?, depart_at = ? WHERE id = ?", [user_id, date, date, id_travel], (error, results) => {
        baseError.handleError(error, response)

        db.pool.query("UPDATE tr_travel_dtl SET status = 3, updater_id = ?, updated_at = ?, depart_at = ? WHERE id = ?", [user_id, date, date, id_travel_dtl_now], (error, results) => {
            baseError.handleError(error, response)

            db.pool.query("UPDATE tr_travel_dtl SET status = 1, updater_id = ?, updated_at = ? WHERE id = ?", [user_id, date, id_travel_dtl_next], (error, results) => {
                baseError.handleError(error, response)
            
                response.status(statusCode.success).send({
                    code: statusCode.success,
                    message: "Berhasil mulai perjalanan"
                });
            })
        })
    })
}

exports.travelArriveCustomer = (request, response) => {
    //Data User
    const user_id = request.user_id
    const id_travel = request.body.id_travel
    const id_travel_dtl = request.body.id_travel_dtl
    const arrive_at = request.body.arrive_at
    let date = new Date();

    db.pool.query("UPDATE tr_travel_dtl SET  status = 2, arrive_at = ?, updater_id = ?, updated_at = ? WHERE id = ?", [date, user_id, date, id_travel_dtl], (error, results) => {
        baseError.handleError(error, response)

        const query = "SELECT td.id, td.id_travel, td.sequence, td.id_location, td.arrive_at, td.depart_at, td.status, td.created_at, l.name AS name_location, l.lat, l.lng, l.address, l.phone FROM tr_travel_dtl td "+
            "JOIN m_location l ON td.id_location = l.id AND l.flag = 1 "+
            "WHERE td.id_travel = ? AND td.flag = 1"

        db.pool.query(query, [id_travel], (error, results) => {
            baseError.handleError(error, response)

            if (results.length == 0) {
                return response.status(statusCode.empty_data).send({
                    code: statusCode.empty_data,
                    message: "Data perjalanan detail tidak ditemukan"
                });
            }
            
            response.status(statusCode.success).send({
                code: statusCode.success,
                message: "Data perjalanan detail ditemukan",
                data: results
            });
        })
    })
}

exports.travelDepartCustomer = (request, response) => {
    //Data User
    const user_id = request.user_id
    const id_travel = request.body.id_travel
    const id_travel_dtl_now = request.body.id_travel_dtl_now
    const id_travel_dtl_next = request.body.id_travel_dtl_next
    const depart_at = request.body.depart_at
    let date = new Date();

    db.pool.query("UPDATE tr_travel_dtl SET status = 3, depart_at = ?, updater_id = ?, updated_at = ? WHERE id = ?", [date, user_id, date, id_travel_dtl_now], (error, results) => {
        baseError.handleError(error, response)

        db.pool.query("UPDATE tr_travel_dtl SET status = 1, updater_id = ?, updated_at = ? WHERE id = ?", [user_id, date, id_travel_dtl_next], (error, results) => {
            baseError.handleError(error, response)

            const query = "SELECT td.id, td.id_travel, td.sequence, td.id_location, td.arrive_at, td.depart_at, td.status, td.created_at, l.name AS name_location, l.lat, l.lng, l.address, l.phone FROM tr_travel_dtl td "+
                "JOIN m_location l ON td.id_location = l.id AND l.flag = 1 "+
                "WHERE td.id_travel = ? AND td.flag = 1"

            db.pool.query(query, [id_travel], (error, results) => {
                baseError.handleError(error, response)
                
                if (results.length == 0) {
                    return response.status(statusCode.empty_data).send({
                        code: statusCode.empty_data,
                        message: "Data perjalanan detail tidak ditemukan"
                    });
                }
                
                response.status(statusCode.success).send({
                    code: statusCode.success,
                    message: "Data perjalanan detail ditemukan",
                    data: results
                });
            })
        })
    })
}

exports.travelComplete = (request, response) => {
    //Data User
    const user_id = request.user_id
    const id_travel = request.body.id_travel
    const id_travel_dtl = request.body.id_travel_dtl
    const arrive_at = request.body.arrive_at
    let date = new Date();

    db.pool.query("UPDATE tr_travel SET status = 3, updater_id = ?, updated_at = ?, arrive_at = ? WHERE id = ?", [user_id, date, date, id_travel], (error, results) => {
        baseError.handleError(error, response)

        db.pool.query("UPDATE tr_travel_dtl SET status = 3, updater_id = ?, updated_at = ?, arrive_at = ? WHERE id = ?", [user_id, date, date, id_travel_dtl], (error, results) => {    
            baseError.handleError(error, response)

            const query = "SELECT td.id, td.id_travel, td.sequence, td.id_location, td.arrive_at, td.depart_at, td.status, td.created_at, l.name AS name_location, l.lat, l.lng, l.address, l.phone FROM tr_travel_dtl td "+
                "JOIN m_location l ON td.id_location = l.id AND l.flag = 1 "+
                "WHERE td.id_travel = ? AND td.flag = 1"

            db.pool.query(query, [id_travel], (error, results) => {
                baseError.handleError(error, response)

                if (results.length == 0) {
                    return response.status(statusCode.empty_data).send({
                        code: statusCode.empty_data,
                        message: "Data perjalanan detail tidak ditemukan"
                    });
                }
                
                response.status(statusCode.success).send({
                    code: statusCode.success,
                    message: "Data perjalanan detail ditemukan",
                    data: results
                });
            })
        })
    })
}

exports.getTravelTotal = (request, response) => {
    const id_company = request.body.id_company
    const id_role = request.body.id_role
    const id_driver = request.user_id
    const status = request.body.status
    const start_date = request.body.start_date + " 00:00:00"
    const end_date = request.body.end_date + " 23:59:59"

    var query = "SELECT COUNT(t.flag) AS total FROM tr_travel t "+
        "LEFT JOIN m_user u ON t.id_driver = u.id AND u.flag = 1 "+
        "WHERE t.flag = 1 AND t.depart_plan_at >= '"+start_date+"' AND t.depart_plan_at <= '"+end_date+"'"

    query += (id_company != null? (" AND t.id_company="+id_company) : "")
    query += (id_role == 5? (" AND t.id_driver="+id_driver) : "")
    query += (status != null? (" AND t.status="+status) : "")

    db.pool.query(query, (error, results) => {
        baseError.handleError(error, response)

        if (results.length == 0) {
            return response.status(statusCode.empty_data).send({         
                code: statusCode.empty_data,
                message: "Data perjalanan tidak ditemukan"
            });
        }

        response.status(statusCode.success).send({
            code: statusCode.success,
            message: "Data perjalanan ditemukan",
            data: results[0]
        });
    })
}