import nodemailer from "nodemailer";
import "dotenv/config";

interface ISendEmail {
  to: string;
  subject: string;
  body: string;
}

export const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = ({ to, subject, body }: ISendEmail) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: body,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Erro ao mandar o email: ", error);
    } else {
      console.log("E-mail enviado: ", info.response);
    }
  });
};
