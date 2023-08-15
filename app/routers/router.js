let express = require('express');
let router = express.Router();
let auth = require("../middleware/auth.js");
// const upload = require("../middleware/upload.js");
 
//  userController
const user = require('../controllers/userController.js');
router.post('/api/user/detail', auth.verifyToken, user.getUserDetail);
router.post('/api/user/all', auth.verifyToken, user.getUsers);
router.post('/api/user/add', auth.verifyToken, user.addUser);
router.post('/api/user/update', auth.verifyToken, user.editUser);
router.post('/api/user/delete', auth.verifyToken, user.deleteUser);

router.post('/api/login', user.login);
router.post('/api/register', user.register);

// const version = require('../controllers/versionController.js');
// router.post('/api/version/apps', version.getVersion);

//  roleController
const role = require("../controllers/roleController.js");
router.get('/api/role', auth.verifyToken, role.getRoles);

//  vehicleController
const vehicle = require("../controllers/vehicleController.js");
router.post('/api/vehicle/detail', auth.verifyToken, vehicle.getVehicleDetail);
router.post('/api/vehicle/all', auth.verifyToken, vehicle.getVehicles);
router.post('/api/vehicle/add', auth.verifyToken, vehicle.addVehicle);
router.post('/api/vehicle/edit', auth.verifyToken, vehicle.editVehicle);
router.post('/api/vehicle/delete', auth.verifyToken, vehicle.deleteVehicle);

//  companyController
const company = require("../controllers/companyController.js");
router.get('/api/companies', auth.verifyToken, company.getAllCompany);
router.post('/api/company', auth.verifyToken, company.getCompany);
router.post('/api/company/edit', auth.verifyToken, company.editCompany);
router.post('/api/company/delete', auth.verifyToken, company.deleteCompany);

//  locationController
const location = require("../controllers/locationController.js");
router.post('/api/location/all', auth.verifyToken, location.getAllLocation);
router.post('/api/location/detail', auth.verifyToken, location.getLocationDetail);
router.post('/api/location/add', auth.verifyToken, location.addLocation);
router.post('/api/location/edit', auth.verifyToken, location.editLocation);
router.post('/api/location/delete', auth.verifyToken, location.deleteLocation);

//  travelController
const travel = require("../controllers/travelController.js");
router.post('/api/travel/add', auth.verifyToken, travel.addTravel);
router.post('/api/travel', auth.verifyToken, travel.getTravel);
router.post('/api/travel/edit', auth.verifyToken, travel.editTravel);
router.post('/api/travel/edit-status', auth.verifyToken, travel.updateTravelStatus);
router.post('/api/travel/start', auth.verifyToken, travel.travelStart);
router.post('/api/travel/arrive-customer', auth.verifyToken, travel.travelArriveCustomer);
router.post('/api/travel/depart-customer', auth.verifyToken, travel.travelDepartCustomer);
router.post('/api/travel/complete', auth.verifyToken, travel.travelComplete);
router.post('/api/travel-dtl', auth.verifyToken, travel.getTravelDtl);

//  trackingController
const tracking = require("../controllers/trackingController.js");
router.post('/api/tracking/add', auth.verifyToken, tracking.addTracking);
router.post('/api/tracking', auth.verifyToken, tracking.getTracking);

module.exports = router;