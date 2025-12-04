import { onRequest } from "firebase-functions/v2/https";
import { completeJobController } from "./controllers";
import dotenv from "dotenv";
import path from "path";
// Only load .env in development/emulator
if (process.env.NODE_ENV == "development") {
  dotenv.config({ path: path.join(__dirname, "../.env") });
}

export const completeJob = onRequest(
  {
    cors: true,
    invoker: "public",
  },
  completeJobController
);
