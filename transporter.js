const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: "singhshalini6599@gmail.com",
      pass: "yalm hpzy unku bzhc",//16 character
    },
  });

module.exports = {
    transporter
}