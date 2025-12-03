import { onRequest } from "firebase-functions/v2/https";
import sgMail from "@sendgrid/mail";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - puppeteer-extra extends puppeteer dynamically
import puppeteer from "puppeteer-extra";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import * as functions from "firebase-functions";

puppeteer.use(StealthPlugin());

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

// 🔽 Cloud function definition
export const yelpStealthTest = onRequest(async (req, res) => {
  // Optional but recommended — set default launch args once
  const launchOptions = {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  };
  console.log("🚀 Launching Puppeteer (Stealth Mode)...");
  const browser = await puppeteer.launch(launchOptions);
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"
  );

  await page.goto("https://biz.yelp.com/login", {
    waitUntil: "networkidle2",
    timeout: 60000,
  });

  await (page as any).waitForTimeout(5000);
  await page.screenshot({ path: "/tmp/yelp-login-stealth.png" });

  console.log("📸 Screenshot saved to /tmp/yelp-login-stealth.png");

  await browser.close();
  res.send("✅ Puppeteer (stealth) test complete!");
});

export const yelpLoginTest = onRequest(async (req, res) => {
  console.log("🚀 Launching Puppeteer for Yelp login...");

  const { email, password } = functions.config().yelp;
  if (!email || !password) {
    res.status(500).send("❌ Missing Yelp credentials in Firebase config");
    return;
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.goto("https://biz.yelp.com/login", {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    console.log("🌐 Page loaded. Typing credentials...");
    await page.waitForSelector('input[name="email"]', { visible: true });
    await page.type('input[name="email"]', email, { delay: 50 });

    await page.waitForSelector('input[name="password"]', { visible: true });
    await page.type('input[name="password"]', password, { delay: 50 });

    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: "networkidle2" }),
    ]);

    // Check for a dashboard element after login
    const dashboardSelector = "nav"; // adjust if needed
    const loggedIn = await page.$(dashboardSelector);

    if (loggedIn) {
      console.log("✅ Successfully logged in to Yelp!");
      res.send("✅ Successfully logged in to Yelp!");
    } else {
      console.error("❌ Login failed — could not find dashboard element.");
      res
        .status(401)
        .send(
          "❌ Login failed — invalid credentials or page structure changed."
        );
    }
  } catch (err: any) {
    console.error("🔥 Puppeteer error:", err);
    res.status(500).send(`🔥 Puppeteer error: ${err.message}`);
  } finally {
    await browser.close();
  }
});
