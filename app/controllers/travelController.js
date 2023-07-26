const db = require('../config/dbConfig.js');

exports.addTravel = (request, response) => {
    //Data Travel
    const id_company = request.body.id_company
    const id_vehicle = request.body.id_vehicle
    const id_driver = request.body.id_driver
    const depart_plan_at = request.body.depart_plan_at
    const arrive_plan_at = request.body.arrive_plan_at
    const creator_id = request.body.creator_id

    //Data Travel Dtl
    const travel_dtl = request.body.travel_dtl

    db.pool.query('INSERT INTO tr_travel (id_company, id_vehicle, id_driver, depart_plan_at, arrive_plan_at, creator_id) VALUES (?, ?, ?, ?, ?, ?)', [id_company, id_vehicle, id_driver, depart_plan_at, arrive_plan_at, creator_id], (error, results) => {
        if (error) {
            response.json({
                code: 400,
                message: error.message,
                error: error
            });
            return
        }
        const id_travel = results.insertId
        let values = [];
        for (let i = 0; i < travel_dtl.length; i++) {
            values.push([id_travel, travel_dtl[i].sequence, travel_dtl[i].id_location, travel_dtl[i].creator_id])
        }
        db.pool.query('INSERT INTO tr_travel_dtl (id_travel, sequence, id_location, creator_id) VALUES ?', [values], (error, results) => {
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
                message: "Berhasil buat Perjalanan",
                data: results
            });
        })
    })
}

exports.getTravel = (request, response) => {
    const id_company = request.body.id_company
    const query = 'SELECT t.*, u.name AS name_driver, v.name AS name_vehicle, v.no_plate FROM tr_travel t '+
        'JOIN m_user u ON t.id_driver = u.id AND u.flag = 1'+
        'JOIN vehicle v ON t.id_vehicle = v.id AND v.flag = 1'+
        'WHERE t.id_company = ? AND t.flag = 1'

    db.pool.query(query, [id_company], (error, results) => {
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
                message: "Data perjalanan tidak ditemukan"
            });
            return
        }
        response.json({
            code: 200,
            message: "Data perjalanan ditemukan",
            data: results
        });
    })
}

exports.getTravelDtl = (request, response) => {
    const id_travel = request.body.id_travel
    const query = 'SELECT td.*, l.name AS name_location, l.lat, l.lng, l.address, l.phone FROM tr_travel_dtl '+
        'JOIN location l ON td.id_location = l.id AND l.flag = 1'+
        'WHERE id_travel = ? AND flag = 1'

    db.pool.query(query, [id_travel], (error, results) => {
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
                message: "Data perjalanan detail tidak ditemukan"
            });
            return
        }
        response.json({
            code: 200,
            message: "Data perjalanan detail ditemukan",
            data: results
        });
    })
}

exports.updateTravelStatus = (request, response) => {
    //Data User
    const userId = request.userId
    const status = request.body.status
    const id_travel = request.body.id_travel
    let date = new Date();

    db.pool.query('UPDATE tr_travel SET status = ?, updater_id = ?, updated_at = ? WHERE id = ?', [status, userId, date, id_travel], (error, results) => {
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
            message: "Berhasil update status travel"
        });
    })
}

exports.updateTravelDtlStatus = (request, response) => {
    //Data User
    const userId = request.userId
    const status = request.body.status
    const id_travel_dtl = request.body.id_travel_dtl
    let date = new Date();

    db.pool.query('UPDATE tr_travel_dtl SET status = ?, updater_id = ?, updated_at = ? WHERE id = ?', [status, userId, date, id_travel_dtl], (error, results) => {
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
            message: "Berhasil update status travel detail"
        });
    })
}