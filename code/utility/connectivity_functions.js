require('dotenv').config();

const nodemailer = require("nodemailer");

const axios = require("axios");

// let config = {
//   headers: {
//     "authorization": "nisLcN3mKoE54fSzYIFOPT29GlDZQBUbaJMhr7w8kgdpyx0uCeOwtrsBTAjzgieWYCaVd8Ib70JZFcoD",
//     "Content-Type":"application/json"
//   }
// }

// async function sendOtp() {
async function sendOtp(phone,otp,app_id) {

  let data = {
  //   route:"dlt",
  //   sender_id:"NNDTFA",
    message:"156108",
    variables_values:`${otp}|${app_id}`,
    flash:0,
    numbers:phone
  };
  console.log(data);
  try {
    // const response = await axios.post('https://www.fast2sms.com/dev/bulkV2',data,config);
    const response = await axios.post(`http://smsfortius.in/api/mt/SendSMS?user=gravityc&password=gravityc123&senderid=GRVITY&channel=Trans&DCS=0&flashsms=0&number=${data.numbers}&text=Your OTP is ${data.variables_values} GRAVITY CLASSES&route=02&peid=1201158090643424916&DLTTemplateId=1607100000000307033`);

    console.log(response);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

// sendOtp("8126464447","12313","adsafafdas");



const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const smtp_email = process.env.SMTP_EMAIL;
const smtp_password = process.env.SMTP_PASSWORD;

console.log(smtp_password+" "+smtp_email);


const client = require('twilio')(accountSid, authToken);

async function sendEmail(email,body) {
  //body = {text,html,subject}
  let transporter = nodemailer.createTransport({
    host: "smtp.zoho.in",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: smtp_email,
      pass: smtp_password, 
    },
  });

  console.log(transporter);

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Neoned71 🐶" <iamn71@neoned71.com>', // sender address
    to: email, // list of receivers
    subject: body.subject, // Subject line
    text: body.text, // plain text body
    html: body.html, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

async function sendPhone(number,body){
  let message = await client.messages.create({body:body.text,from:'+18166696855',to: number});
  console.log(message.status);
  return message.sid;
}

async function sendMessage(contact,body,destinationType){
  if(destinationType=='email')
  {
    return await sendEmail(contact,body);
  }
  else if (destinationType=='phone'){
    return await sendPhone(contact,body);
  }
}

//


module.exports={sendOtp,sendEmail};