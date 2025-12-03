# controllers/

This folder contains the **entrypoint functions** for your backend.  
A controller is the first piece of code that runs when an external event triggers your system.

Controllers handle operational workflows such as:

- Job completion  
- Quote request  
- Scheduling request  
- Equipment check-in  
- Deposit check  
- QC / go-back workflows  
- Any future REST API endpoints  

## Trigger Types

Controllers may be invoked by:

- HTTP requests (REST API)
- Tally webhooks
- Pumble actions or slash commands (future)
- Scheduled Cloud Functions (cron jobs)
- Internal system events

## Responsibilities of a Controller

A controller should:

1. **Receive and validate** the incoming request  
2. **Parse** the input payload  
3. **Call domain/business logic** from the `/domains` folder  
4. **Call integration modules** from `/services` when needed  
   (Pumble, GHL, OpenAI, Maps, etc.)  
5. **Return a response or post updates** (e.g., messages to Pumble)  
6. **Optionally write to the database**

Controllers should remain **thin and focused on orchestration**.  
All business logic belongs in `/domains`.  
All API integrations and SDK wrappers belong in `/services`.

## Example Controller Files

- `jobComplete.ts`  
- `quoteRequest.ts`  
- `scheduleRequest.ts`  
- `equipmentCheckin.ts`  
- `depositCheck.ts`
