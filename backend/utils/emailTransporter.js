
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER, // depuis .env
    pass: process.env.MAILTRAP_PASS,
  },
});


const sendEmail = async ({ email, subject, message }) => {
  const mailOptions = {
    from: '"AdoptiPet" <noreply@adoptipet.com>',
    to: email,
    subject: subject,
    text: message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent:", info.messageId);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};

module.exports = sendEmail; 
