import { onRequest } from "firebase-functions/v2/https";
import sgMail from "@sendgrid/mail";
import * as functions from "firebase-functions";

const config = functions.config();
const SENDGRID_KEY = config.sendgrid.key;
const TO_EMAIL = "oliver@getwindowpros.com";
const FROM_EMAIL = "oliver@getwindowpros.com";

export const helloWorld = onRequest((req, res) => {
  console.log("✅ Hello World function triggered!");
  res.send("Hello from Firebase Functions v2 👋");
});

sgMail.setApiKey(SENDGRID_KEY);

export const testSendgrid = onRequest(async (req, res) => {
  try {
    await sgMail.send({
      to: TO_EMAIL,
      from: FROM_EMAIL,
      subject: "✅ Firebase SendGrid Test",
      text: "If you're reading this, SendGrid + Firebase Functions are working perfectly!",
    });

    console.log("Email sent successfully!");
    res.send("✅ Email sent successfully!");
  } catch (err: any) {
    console.error("Error sending email:", err);
    res.status(500).send(`❌ Failed to send email: ${err.message}`);
  }
});
