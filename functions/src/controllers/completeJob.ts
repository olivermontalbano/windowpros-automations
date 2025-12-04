import {
  parseJobCompletionWebhook,
  structureJobCompletionMessage,
  structureJobCompletionFormButtonMessage,
} from "../domains/jobs";
import { sendPumbleMessage } from "../services/pumble";

export async function completeJobController(req: any, res: any) {
  try {
    const input = parseJobCompletionWebhook(req.body);
    const { summary } = structureJobCompletionMessage(input);

    await sendPumbleMessage({
      channelName: "fulfillment",
      text: summary,
    });

    const formButtonMessage = structureJobCompletionFormButtonMessage();

    await sendPumbleMessage({
      channelName: "fulfillment",
      text: formButtonMessage,
    });

    res.status(200).send({ ok: true });
  } catch (err: any) {
    console.error("completeJob error:", err);
    res.status(500).send({ error: err.message });
  }
}
