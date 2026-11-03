import nodemailer from "nodemailer";
import { site } from "@/content/site";

export type Mail = { subject: string; text: string; html: string };
export type Mailer = (mail: Mail) => Promise<void>;

/** Sends from and to the club Gmail. With no app password set (local dev), logs the email instead. */
export function getMailer(): Mailer {
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!pass) {
    return async ({ subject, text }) => {
      console.log(`[projects] GMAIL_APP_PASSWORD not set; email not sent.\nSubject: ${subject}\n${text}`);
    };
  }

  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: site.contactEmail, pass },
  });
  return async ({ subject, text, html }) => {
    await transport.sendMail({
      from: `"CBC Vanderbilt website" <${site.contactEmail}>`,
      to: site.contactEmail,
      subject,
      text,
      html,
    });
  };
}
