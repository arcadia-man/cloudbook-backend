var nodemailer = require("nodemailer");
const otp = (email, subj, otp) => {
  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    // port: 587,
    // secure: false,
    port: 465,
    secure: true,
    // requireTLS: true,
    auth: {
      user: "arcadiaman123@gmail.com",
      pass: "xyszzezfajgewsvt",
    },
  });

  var mailOptions = {
    from: "Cloud book",
    to: email,
    subject: subj,
    text: otp,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
module.exports = otp;
