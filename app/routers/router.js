let express = require('express');
let router = express.Router();
let auth = require("../middleware/auth.js");
// const upload = require("../middleware/upload.js");
 
//  userController
const user = require('../controllers/userController.js');
// router.get('/api/user/all', auth.verifyToken, user.getUsers);
router.post('/api/user/detail', auth.verifyToken, user.getUserById);
// router.post('/api/user/delete', auth.verifyToken, user.deleteUser);
// router.post('/api/user/updateProfile', auth.verifyToken, user.updateProfile);

router.post('/api/login', user.login);
router.post('/api/register', user.register);

// const version = require('../controllers/versionController.js');
// router.post('/api/version/apps', version.getVersion);

//  roleController
const role = require("../controllers/roleController.js");
router.get('/api/role', auth.verifyToken, role.getRoles);

//  vehicleController
const vehicle = require("../controllers/vehicleController.js");
router.post('/api/vehicle', auth.verifyToken, vehicle.getVehicle);
router.post('/api/vehicles', auth.verifyToken, vehicle.getVehicles);
router.post('/api/vehicle/add', auth.verifyToken, vehicle.addVehicle);
router.post('/api/vehicle/edit', auth.verifyToken, vehicle.editVehicle);
router.post('/api/vehicle/delete', auth.verifyToken, vehicle.deleteVehicle);

module.exports = router;