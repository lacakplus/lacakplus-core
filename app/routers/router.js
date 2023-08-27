let express = require('express');
let router = express.Router();
let auth = require("../middleware/auth.js");
// const upload = require("../middleware/upload.js");
 
//  userController
const user = require('../controllers/userController.js');
router.post('/api/users', auth.verifyToken, user.getUsers);
router.post('/api/user', auth.verifyToken, user.getUserById);
router.post('/api/user/add', auth.verifyToken, user.addUser);
router.post('/api/user/update', auth.verifyToken, user.editUser);
router.post('/api/user/delete', auth.verifyToken, user.deleteUser);

router.post('/api/login', user.login);
router.post('/api/register', user.register);

// const version = require('../controllers/versionController.js');
// router.post('/api/version/apps', version.getVersion);

//  roleController
const role = require("../controllers/roleController.js");
router.get('/api/roles', auth.verifyToken, role.getRoles);

//  vehicleController
const vehicle = require("../controllers/vehicleController.js");
router.post('/api/vehicles', auth.verifyToken, vehicle.getVehicles);
router.post('/api/vehicle', auth.verifyToken, vehicle.getVehicleById);
router.post('/api/vehicle/add', auth.verifyToken, vehicle.addVehicle);
router.post('/api/vehicle/edit', auth.verifyToken, vehicle.editVehicle);
router.post('/api/vehicle/delete', auth.verifyToken, vehicle.deleteVehicle);

//  companyController
const company = require("../controllers/companyController.js");
router.get('/api/companies', auth.verifyToken, company.getCompanies);
router.post('/api/company', auth.verifyToken, company.getCompanyById);
router.post('/api/company/edit', auth.verifyToken, company.editCompany);
router.post('/api/company/delete', auth.verifyToken, company.deleteCompany);

//  locationController
const location = require("../controllers/locationController.js");
router.post('/api/locations', auth.verifyToken, location.getLocations);
router.post('/api/location', auth.verifyToken, location.getLocationById);
router.post('/api/location/add', auth.verifyToken, location.addLocation);
router.post('/api/location/edit', auth.verifyToken, location.editLocation);
router.post('/api/location/delete', auth.verifyToken, location.deleteLocation);

//  travelController
const travel = require("../controllers/travelController.js");
router.post('/api/travel/add', auth.verifyToken, travel.addTravel);
router.post('/api/travels', auth.verifyToken, travel.getTravels);
router.post('/api/travel', auth.verifyToken, travel.getTravelById);
router.post('/api/travel/edit', auth.verifyToken, travel.editTravel);
router.post('/api/travel/active-travel', auth.verifyToken, travel.activeTravel);
router.post('/api/travel/start', auth.verifyToken, travel.travelStart);
router.post('/api/travel/arrive-customer', auth.verifyToken, travel.travelArriveCustomer);
router.post('/api/travel/depart-customer', auth.verifyToken, travel.travelDepartCustomer);
router.post('/api/travel/complete', auth.verifyToken, travel.travelComplete);
router.post('/api/travel-details', auth.verifyToken, travel.getTravelDetails);

//  trackingController
const tracking = require("../controllers/trackingController.js");
router.post('/api/trackings', auth.verifyToken, tracking.getTrackings);
router.post('/api/tracking/add', auth.verifyToken, tracking.addTracking);
router.post('/api/tracking/position-vehicles', auth.verifyToken, tracking.getPositionVehicles);

module.exports = router;