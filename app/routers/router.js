let express = require('express');
let router = express.Router();
let auth = require("../middleware/auth.js");
// const upload = require("../middleware/upload.js");
 
const user = require('../controllers/userController.js');
router.get('/api/user/all', auth.verifyToken, user.getUsers);
router.post('/api/user/detail', auth.verifyToken, user.getUserById);
router.post('/api/user/delete', auth.verifyToken, user.deleteUser);
router.post('/api/user/updateProfile', auth.verifyToken, user.updateProfile);
router.post('/api/user/totalcount', auth.verifyToken, user.getTotalCount);

router.post('/api/login', user.login);
router.post('/api/register', user.register);


// const uploadController = require("../controllers/uploadController.js");
// router.post("/api/upload", auth.verifyToken, upload.single("file"), uploadController.upload);

module.exports = router;