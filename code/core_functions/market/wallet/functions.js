require('dotenv').config();

const nodemailer = require("nodemailer");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

async function sendEmail(email,body) {
  //body = {text,html,subject}
  let transporter = nodemailer.createTransport({
    host: "smtp.zoho.in",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'iamn71@neoned71.com',
      pass: 'Mac@neoned71', 
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Piyush 👻" <iamn71@neoned71.com>', // sender address
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

// sendEmail().catch(console.error);

async function sendSMS(number,body){
  let message = await client.messages.create({body:body,from:'+18166696855',to: number});
  console.log(message.status);
  return message.sid;
}

async function sendOTP(contact,body,destinationType){
  if(destinationType=='email')
  {
    return await sendEmail(contact,body);
  }
  else{
    return await sendOTP(contact,body);
  }
}


module.exports=sendOTP;