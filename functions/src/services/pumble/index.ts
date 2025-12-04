/**
 * Pumble Service
 * Handles all communication with the Pumble API
 */

import { AxiosInstance } from "axios";
import { createApiClient } from "../api";

interface SendPumbleMessageType {
  channelName: string;
  text: string;
}

// Lazy-initialized Pumble API client
let pumbleClient: AxiosInstance | null = null;

/**
 * Gets or creates the Pumble API client
 * @return {AxiosInstance}
 */
function getPumbleClient(): AxiosInstance {
  if (pumbleClient) {
    return pumbleClient;
  }

  const apiToken = process.env.PUMBLE_TOKEN;
  if (!apiToken) {
    throw new Error("PUMBLE_TOKEN environment variable is not set");
  }

  const baseApiUrl =
    process.env.PUMBLE_API_URL ||
    "https://pumble-api-keys.addons.marketplace.cake.com";

  const headers = {
    "Api-Key": apiToken,
  };
  pumbleClient = createApiClient(baseApiUrl, headers);
  return pumbleClient;
}

/**
 * Sends a message to a Pumble channel
 * @param {SendPumbleMessageType} options - Message options including channelName and text
 * @return {Promise<void>} Promise that resolves when the message is sent
 * @throws Error if the message fails to send
 */
export async function sendPumbleMessage({
  channelName,
  text,
}: SendPumbleMessageType): Promise<void> {
  if (!channelName) {
    throw new Error("channelName is required");
  }

  if (!text) {
    throw new Error("text is required");
  }

  try {
    const client = getPumbleClient();
    const response = await client.post("/sendMessage", {
      channel: channelName,
      text,
      asbot: true,
    });

    console.log("Message sent to Pumble successfully:", response.data);
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Unknown error occurred";
    throw new Error(`Failed to send Pumble message: ${errorMessage}`);
  }
}
