const e = require("express");
const multer = require("multer");

const imageFilter = (req, file, cb) => {
  cb(null, true);
};

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      // cb(null, "./resource/image");
      cb(null, "/tmp");
    } else if (file.mimetype.startsWith("video")) {
      // cb(null, "./resource/video");
      cb(null, "/tmp");
    } else {
      // cb(null, "./resource/file");
      cb(null, "/tmp");
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

var uploadFile = multer({ storage: storage, fileFilter: imageFilter });
module.exports = uploadFile;