const express = require("express");
const router = express.Router();

const certificatesRoute = require('./certificates/index.js');
// const templatesRoute = require('./templates/index.js');
// const {performValidationUser} = require('../../utility/authentication_functions.js');
router.use('/certificates',certificatesRoute);

module.exports=router;
