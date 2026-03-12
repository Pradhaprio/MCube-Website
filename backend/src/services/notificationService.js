import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

function canSendEmail() {
  return Boolean(env.smtpHost && env.smtpUser && env.smtpPass && env.shopNotificationEmail);
}

export async function sendLeadEmail({ subject, text }) {
  if (!canSendEmail()) {
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass
    }
  });

  await transporter.sendMail({
    from: env.smtpUser,
    to: env.shopNotificationEmail,
    subject,
    text
  });

  return true;
}
