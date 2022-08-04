var nodemailer = require("nodemailer");
const sendmailotp = (email, subj, text) => {
  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: "arcadiaman123@gmail.com",
      pass: "xyszzezfajgewsvt",
    },
  });

  var mailOptions = {
    from: "Cloud Book",
    to: email,
    subject: subj,
    text: text,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
module.exports = sendmailotp;
