import { Router } from 'express';
let router = Router();
import { verifyToken } from "../middleware/auth.js";
import { single } from "../middleware/upload.js";

//  uploadController
import { upload as _upload } from "../controllers/uploadController.js";
router.post("/api/upload", verifyToken, single("file"), _upload);

 
//  userController
import { getUsers, getUserById, addUser, editUser, deleteUser, login, register } from '../controllers/userController.js';
router.post('/api/users', verifyToken, getUsers);
router.post('/api/user', verifyToken, getUserById);
router.post('/api/user/add', verifyToken, addUser);
router.post('/api/user/edit', verifyToken, editUser);
router.post('/api/user/delete', verifyToken, deleteUser);

router.post('/api/login', login);
router.post('/api/register', register);


//  attendanceController
import { addAtendance } from '../controllers/attendanceController.js';
router.post('/api/attendance/add', verifyToken, addAtendance);

// const version = require('../controllers/versionController.js');
// router.post('/api/version/apps', version.getVersion);

//  roleController
import { getRoles } from "../controllers/roleController.js";
router.get('/api/roles', verifyToken, getRoles);

//  vehicleController
import { getVehicles, getVehicleById, addVehicle, editVehicle, deleteVehicle } from "../controllers/vehicleController.js";
router.post('/api/vehicles', verifyToken, getVehicles);
router.post('/api/vehicle', verifyToken, getVehicleById);
router.post('/api/vehicle/add', verifyToken, addVehicle);
router.post('/api/vehicle/edit', verifyToken, editVehicle);
router.post('/api/vehicle/delete', verifyToken, deleteVehicle);

//  companyController
import { getCompanies, getCompanyById, editCompany, deleteCompany } from "../controllers/companyController.js";
router.get('/api/companies', verifyToken, getCompanies);
router.post('/api/company', verifyToken, getCompanyById);
router.post('/api/company/edit', verifyToken, editCompany);
router.post('/api/company/delete', verifyToken, deleteCompany);

//  locationController
import { getLocations, getLocationById, addLocation, editLocation, deleteLocation } from "../controllers/locationController.js";
router.post('/api/locations', verifyToken, getLocations);
router.post('/api/location', verifyToken, getLocationById);
router.post('/api/location/add', verifyToken, addLocation);
router.post('/api/location/edit', verifyToken, editLocation);
router.post('/api/location/delete', verifyToken, deleteLocation);

//  travelController
import { addTravel, getTravels, getTravelById, editTravel, activeTravel, travelStart, travelArriveCustomer, travelDepartCustomer, travelComplete, getTravelTotal, getTravelDetails, editTravelDetails } from "../controllers/travelController.js";
router.post('/api/travel/add', verifyToken, addTravel);
router.post('/api/travels', verifyToken, getTravels);
router.post('/api/travel', verifyToken, getTravelById);
router.post('/api/travel/edit', verifyToken, editTravel);
router.post('/api/travel/active-travel', verifyToken, activeTravel);
router.post('/api/travel/start', verifyToken, travelStart);
router.post('/api/travel/arrive-customer', verifyToken, travelArriveCustomer);
router.post('/api/travel/depart-customer', verifyToken, travelDepartCustomer);
router.post('/api/travel/complete', verifyToken, travelComplete);
router.post('/api/travel/total', verifyToken, getTravelTotal);
router.post('/api/travel-details', verifyToken, getTravelDetails);
router.post('/api/travel-details/edit', verifyToken, editTravelDetails);

//  trackingController
import { getTrackings, addTracking, getPositionVehicles } from "../controllers/trackingController.js";
router.post('/api/trackings', verifyToken, getTrackings);
router.post('/api/tracking/add', verifyToken, addTracking);
router.post('/api/tracking/position-vehicles', verifyToken, getPositionVehicles);

export default router;