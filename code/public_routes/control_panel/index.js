const express = require("express");
const router = express.Router();

const authenticationRoute = require('./authentication/index');
const eventsRoute = require('../../internal_routes/events/panel');
const transactionsRoute = require('../../internal_routes/transactions/panel');
const panelRoute = require('../../internal_routes/panel');
// const marketRoute = require('../../internal_routes/market/panel');
// const filesRoute = require('../../internal_routes/files/panel');
// const certificationsRoute = require('../../internal_routes/certifications/panel');

router.get('/',async function (req,res){
	let ret = { status:"success",message:'Welcome to Panel api root!',content:[{path:"/auth",authentication:"none"}]};
    res.status(200).json(ret);
});

router.use('/authentication/',authenticationRoute);
// router.use('/events/',eventsRoute);
// router.use('/transactions/',transactionsRoute);
router.use(panelRoute);
// router.use('/market/',marketRoute);
// router.use('/files/',filesRoute);
// router.use('/certifications/',certificationsRoute);

module.exports=router;