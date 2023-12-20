const e = require("express");
const multer = require("multer");
const path = require("path");

const imageFilter = (req, file, cb) => {
  cb(null, true);
};

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, path.join(__dirname, '/resource/image'));
    } else if (file.mimetype.startsWith("video")) {
      cb(null, "./resource/video");
    } else {
      cb(null, "./resource/file");
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

var uploadFile = multer({ storage: storage, fileFilter: imageFilter });
module.exports = uploadFile;