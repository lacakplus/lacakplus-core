const db = require('../config/dbConfig.js');
const statusCode = require('../config/statusCode.js');

const File = db.File;

exports.upload = async (req, response) => {
    try{
        console.log(req.file);

        if (req.file) {
            return response.send({
                code: statusCode.success,
                message: "Successful upload " + req.file.mimetype,
                data: req.file.filename
            });
        } else {
            return response.send({
                code: statusCode.empty_data,
                message: "File tidak ditemukan"
            });
        }
        // File.create({
        //     type: req.file.mimetype,
        //     name: req.file.filename
        //   }).then((image) => {
            
        // });
    }catch(error){
        response.send({
            code: statusCode.internal_server_error,
            message: "Error : Can not upload a image",
            error: error.message
        });
    }

}