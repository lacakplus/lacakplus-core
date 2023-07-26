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

    db.pool.query('SELECT * FROM tr_travel WHERE id_company = ? AND flag = 1', [id_company], (error, results) => {
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
            message: "Data perjalanan ditemukan",
            data: results
        });
    })
}

exports.getTravelDtl = (request, response) => {
    const id_travel = request.body.id_travel

    db.pool.query('SELECT * FROM tr_travel_dtl WHERE id_travel = ? AND flag = 1', [id_travel], (error, results) => {
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
            message: "Data perjalanan ditemukan",
            data: results
        });
    })
}