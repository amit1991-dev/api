
require('dotenv').config();
let textlocal = require("textlocal-complete");
//console.log(a);

async function sendSMS(number,body){
	let y = await textlocal.sendSms(process.env.TEXTLOCAL_API_KEY,number,'TXTLCL',body);
	console.log(y);
	y.data.errors.forEach(function (item){
		console.log(item)
	});
	return y;
}
//let y=a.sendSms('NTU2YTY3NWE0OTY2NWE2NDZlNTM3OTc0NDE3ODdhNGM=', 918126464447, 'TXTLCL', 'Message');
sendSMS(918126464447,"something");
