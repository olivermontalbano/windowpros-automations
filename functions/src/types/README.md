# types/

This folder contains **shared TypeScript types** used across multiple domains, controllers, or services.

Only types that are **reused in more than one area** should live here.

Most domain-specific types (e.g., WindowQuoteInput, TechnicianMetrics, SchedulingRules) should instead live **inside their respective domain folders**.

This folder is reserved for:

- Shared service types (Pumble, GHL, OpenAI, Maps, Firestore)
- Shared enums or constants used across domains
- Public interfaces for REST endpoints
- Tally webhook payload structures
- Generic utility types (e.g., Result<T>, WithTimestamp)

By keeping shared types here, you ensure a single source of truth while keeping domain folders clean and self-contained.

---

## What Should Go in `/types`

These kinds of types belong here:

### **1. Shared Service/API Types**
Used by multiple controllers or domains:
- `PumbleMessagePayload`
- `GHLUpdatePayload`
- `OpenAIResponse`
- `FirestoreJobRecord`
- `GeocodeResult`

### **2. Shared Global Enums**
- `ServiceType = "window" | "gutter" | "solar"`
- `StoryCount = 1 | 2 | 3`

### **3. Shared Webhook / Request Types**
- `TallyWebhookPayload`
- `ApiErrorResponse`
- `ApiSuccessResponse`

### **4. Generic Structures**
Reusable helpers:
- `Paginated<T>`
- `Result<T>`
- `ValidationError`

---

## What Should *Not* Go in `/types`

These belong **inside each domain folder**:

- `TechnicianMetrics`
- `TechUpdateInput`
- `CalculateWindowQuoteInput`
- `SuggestedSlots`
- `DispatchRuleSet`

Reason:  
They only matter within that domain and shouldn't clutter the global namespace.

---
