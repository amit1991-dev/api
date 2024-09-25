const express = require("express");
const router = express.Router();

const certificatesRoute = require('./certificates/index.js');
const templatesRoute = require('./templates/index.js');
const {performValidationPanel} = require('../../utility/authentication_functions.js');
router.use('/certificates',performValidationPanel,certificatesRoute);
router.use('/templates',performValidationPanel,templatesRoute);

module.exports=router;
