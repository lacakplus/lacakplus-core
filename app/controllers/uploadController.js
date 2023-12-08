const db = require('../config/dbConfig.js');
const statusCode = require('../config/statusCode.js');

const File = db.File;

exports.upload = async (req, res) => {
    try{
        console.log(req.file);

        if (req.file == undefined) {
            return res.send("File is empty");
        }
        File.create({
            type: req.file.mimetype,
            name: req.file.filename
          }).then((image) => {
            response.status(statusCode.success).send({
                code: statusCode.success,
                message: "Successful upload " + req.file.mimetype,
                data: req.file.filename
            });
        });
    }catch(error){
        response.status(statusCode.internal_server_error).send({
            code: statusCode.internal_server_error,
            message: "Error : Can not upload a image",
            error: error.message
        });
    }

}