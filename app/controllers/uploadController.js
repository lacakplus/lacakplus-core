const fs = require("fs");
const db = require('../config/dbConfig.js');
const { use } = require('../routers/router.js');
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
            res.status(200).json({
                code: 200,
                message: "Successful upload " + req.file.mimetype,
                data: req.file.filename
            });
        });
    }catch(error){
        res.status(500).json({
            code: 500,
            message: "Error : Can not upload a image",
            error: error.message
        });
    }

}