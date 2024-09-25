const express = require("express");
const router = express.Router();

const testsRoute = require('./tests/index');
const managementRoute = require('./management/index');
const coursesRoute = require('./courses/index');

router.use('/tests/',testsRoute);
router.use('/management/',managementRoute);
router.use('/courses/',coursesRoute);
// router.use('/wallet/',walletRoute);

module.exports=router;