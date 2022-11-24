const nodemailer = require("nodemailer");
const pug = require("pug");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.name = user._id.slice(3);
    this.url = url;
    this.from = `Admin 1 <${process.env.EMAIL_FROM}>`;
  }
  newTransport() {
    return nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD, // App password in gmail
      },
      tls: { rejectUnauthorized: false },
    });
  }
  async send(template, subject) {
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        name: this.name,
        url: this.url,
        subject,
      }
    );
    const emailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
    };
    await this.newTransport().sendMail(emailOptions);
  }
  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Your password reset link, (Valid for only 10 minutes)"
    );
  }
  async sendUsername() {
    await this.send("username", "Your Reddit Username");
  }
};
