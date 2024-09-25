//const sms_client = ;
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

async function sendSMS(number,body){
	let message = await client.messages.create({body:body,from:'+18166696855',to: number});
	console.log(message.status);
	return message.sid;
}

module.exports=sendSMS;
//sendSMS('+918126464447','this is a body');
