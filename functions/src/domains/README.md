# domains/

This folder contains all **business logic** for Window Pros.  
Domains define *how your business works*, separate from controllers and external APIs.

A domain module handles the core reasoning for a specific area, such as:

- Quoting (window, gutter, solar)
- Scheduling logic
- Job completion handling
- Technician workflows
- KPI calculations
- Customer lifecycle workflows
- Routing / capacity logic
- Pricing rules
- Dispatch logic

Domains **never** talk directly to external APIs.  
They only call services (API wrappers) when needed.

## Responsibilities of a Domain

A domain should:

1. **Implement business rules**  
   (e.g., pricing formulas, scheduling constraints, quoting models)
2. **Handle complex logic**  
   (e.g., deriving job duration from features and regressions)
3. **Validate and transform raw data**
4. **Prepare messages for controllers to send via services**
5. **Remain reusable and testable**
6. **Never contain API keys or HTTP calls**

Domains are where your company's actual operations live.

## Folder Examples

- `quoting/`  
  - `calculateWindowQuote.ts`  
  - `calculateGutterQuote.ts`  
  - `calculateSolarQuote.ts`

- `scheduling/`  
  - `suggestTimeSlots.ts`  
  - `routeConstraints.ts`

- `jobCompletion/`  
  - `buildJobSummary.ts`  
  - `validateTechInput.ts`

- `technicians/`  
  - `computeKPIs.ts`  
  - `updateTechMetrics.ts`

## Example Usage Pattern

Controllers → Domains → Services

```ts
// controller
import { calculateQuote } from "../domains/quoting";
import { sendPumbleMessage } from "../services/pumble";

export async function quoteRequestController(req, res) {
  const data = req.body;

  // Business logic lives here
  const quote = calculateQuote(data);

  // External communication happens via services
  await sendPumbleMessage({
    channelId: "...",
    text: `Estimated quote: $${quote}`,
  });

  res.status(200).send({ ok: true });
}
