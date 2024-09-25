const express = require("express");
const router = express.Router();

const verificationRoute = require('../../internal_routes/user/verification/index');
const authenticationRoute = require('../../internal_routes/user/authentication/index');
const eventsRoute = require('../../internal_routes/events/index');
const financeRoute = require('../../internal_routes/finance/index');

const {performValidationUser,performValidationPanel} = require('../../utility/authentication_functions.js');


const userRoute = require("../../internal_routes/user/index");
const studentsRoute = require("../../internal_routes/student_center/index");
const facultiesRoute = require("../../internal_routes/student_center/faculties");

router.use("/users",userRoute);
router.use("/students",studentsRoute);
router.use("/faculties",performValidationUser,facultiesRoute);
router.use('/verification',verificationRoute);
router.use('/authentication',authenticationRoute);


router.use('/events',eventsRoute);
router.use('/finance',financeRoute);
// router.use('/market/',marketRoute);
// router.use('/education/',educationRoute);
// router.use('/travel/',travelRoute);
// router.use('/restaurant/',restaurantRoute);
// router.use('/hotel/',hotelRoute);
// router.use('/certifications',certificationsRoute);
// router.use('/payments',paymentsRoute);

module.exports=router;
