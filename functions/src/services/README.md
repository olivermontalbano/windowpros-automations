# services/

This folder contains **integration modules** — code that talks to external systems or external APIs.

Services handle all communication with:

- Pumble (sending messages, posting buttons, etc.)
- GHL (customer messaging, pipeline updates)
- OpenAI (quoting logic, image analysis, ladder-access reasoning, etc.)
- Firebase / Firestore (reads & writes)
- Google Maps / Mapbox (geocoding, distance matrix, 3D tiles)
- Email / SMS providers
- Any other third-party APIs

## Responsibilities of a Service

A service should:

1. **Wrap one external system** behind a clean interface  
2. **Expose simple, predictable functions** (e.g. `sendMessage()`, `geocodeAddress()`)
3. **Hide API keys, headers, and low-level HTTP logic**
4. **Perform retries, error handling, and logging**
5. **Never contain business logic** — only technical API interaction

Services make your controllers and domains clean and readable by providing reusable adapters.

## Examples of Service Files

- `pumble.ts`  
- `ghl.ts`  
- `openai.ts`  
- `firestore.ts`  
- `maps.ts`  
- `email.ts`

## Example Usage Pattern

Controllers call **domains**,  
and **domains** call services like this:

```ts
import { sendPumbleMessage } from "../services/pumble";
import { calculateQuote } from "../domains/quoting";

export async function quoteRequestController(req, res) {
  const data = req.body;
  const quote = calculateQuote(data);

  await sendPumbleMessage({
    channelId: "...",
    text: `Estimated quote: $${quote}`,
  });

  res.status(200).send({ ok: true });
}
