const db = require('../config/dbConfig.js');
const statusCode = require('../config/statusCode.js');

const File = db.File;

exports.uploadSingle = async (req, response) => {
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
    } catch(error) {
        response.send({
            code: statusCode.internal_server_error,
            message: "Error : Can't upload a file",
            error: error.message
        });
    }
}

// exports.uploadMultiple = async (req, response) => {
//     try{
//         console.log(req.file);

//         if (req.files.length) {
//             return response.send({
//                 code: statusCode.success,
//                 message: "Successful upload files",
//                 data: req.file.filename
//             });
//         } else {
//             return response.send({
//                 code: statusCode.empty_data,
//                 message: "File tidak ditemukan"
//             });
//         }
//     } catch(error) {
//         response.send({
//             code: statusCode.internal_server_error,
//             message: "Error : Can not upload a file",
//             error: error.message
//         });
//     }
// }