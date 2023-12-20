const db = require('../config/dbConfig.js');
const statusCode = require('../config/statusCode.js');

const File = db.File;

exports.upload = async (req, response) => {
    try{
        console.log(req.file);

        if (req.file == undefined) {
            return response.send("File is empty");
        } else {
            response.status(statusCode.success).send({
                code: statusCode.success,
                message: "Successful upload " + req.file.mimetype,
                data: req.file.filename
            });
        }
        // File.create({
        //     type: req.file.mimetype,
        //     name: req.file.filename
        //   }).then((image) => {
            
        // });
    }catch(error){
        response.status(statusCode.internal_server_error).send({
            code: statusCode.internal_server_error,
            message: "Error : Can not upload a image",
            error: error.message
        });
    }

}