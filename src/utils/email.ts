import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendNotificationEmail = async (from: string, subject: string, text: string) => {
  await transporter.sendMail({
    from,
    to:`"Support System" <${process.env.EMAIL_USER}>`,
    subject,
    text,
  });
};
