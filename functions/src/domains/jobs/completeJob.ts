import { JobCompletionInput } from "./types";

export function structureJobCompletionMessage(input: JobCompletionInput): {
  summary: string;
} {
  const lines: string[] = [];

  // Header
  lines.push("✅ Job Completed");
  lines.push(`Technician: ${input.technicianName}`);
  lines.push(`Customer: ${input.customerFirstName}`);
  lines.push(`Job Time: ${input.jobTime}`);
  lines.push(`Payment Method: ${input.paymentMethod}`);
  if (input.services && input.services.length > 0) {
    lines.push(`Services: ${input.services.join(", ")}`);
  }
  lines.push("");

  // General job info
  if (input.general.scope) {
    lines.push(`Scope: ${input.general.scope}`);
  }
  if (input.general.notes) {
    lines.push(`Notes: ${input.general.notes}`);
  }

  // Gutter section (if present)
  if (input.gutter) {
    lines.push("");
    lines.push("--- Gutter Cleaning Details ---");
    lines.push(`Debris Level: ${input.gutter.debrisLevel}`);
    lines.push(`Gutter Guards: ${input.gutter.guardsType}`);
    lines.push(`Guard Difficulty: ${input.gutter.guardDifficulty}`);
    lines.push(`Downspouts Clogged: ${input.gutter.downspoutsClogged}`);
    lines.push(`Downspout Difficulty: ${input.gutter.downspoutDifficulty}`);
    lines.push(
      `Two Story Ladder Required: ${input.gutter.twoStoryLadderRequired}`
    );
    lines.push(`Debris Cleaned: ${input.gutter.debrisCleaned}`);
    lines.push(`Photos Sent to Customer: ${input.gutter.sentPhotosToCustomer}`);
  }

  return {
    summary: lines.join("\n"),
  };
}

export function structureJobCompletionFormButtonMessage(): string {
  return `━━━━━━━━━━━━━━━━━
:large_green_square: <https://tally.so/r/Zj9q9y|SUBMIT JOB COMPLETION FORM>
:point_right: https://tally.so/r/Zj9q9y
━━━━━━━━━━━━━━━━━`;
}

export function parseJobCompletionWebhook(payload: any): JobCompletionInput {
  const fields = payload?.data?.fields || [];

  // Helper to get field by label
  const getField = (label: string) =>
    fields.find((f: any) => f.label === label);

  // Helper to extract value from field
  // For MULTIPLE_CHOICE: maps IDs to option text, returns first value
  // For MULTI_SELECT: maps IDs to option text, returns array of all values
  // For INPUT_TEXT/TEXTAREA: returns the string value directly
  const get = (label: string): string => {
    const field = getField(label);
    if (!field) return "";

    // For multiple choice fields, value is an array of IDs (but we only want the first)
    if (field.type === "MULTIPLE_CHOICE") {
      const valueIds = Array.isArray(field.value) ? field.value : [];
      if (valueIds.length === 0) return "";

      // Map the first ID to its option text
      const option = field.options?.find((opt: any) => opt.id === valueIds[0]);
      return option?.text || "";
    }

    // For multi-select fields, we need a separate function to get all values
    // (handled by getAllMultiSelect below)

    // For text input fields, value is a string
    return field.value || "";
  };

  // Helper to get all selected values from a MULTI_SELECT field
  const getAllMultiSelect = (label: string): string[] => {
    const field = getField(label);
    if (!field || field.type !== "MULTI_SELECT") return [];

    const valueIds = Array.isArray(field.value) ? field.value : [];
    if (valueIds.length === 0) return [];

    // Map all IDs to their option texts
    return valueIds
      .map((id: string) => {
        const option = field.options?.find((opt: any) => opt.id === id);
        return option?.text;
      })
      .filter((text: string | undefined): text is string => !!text);
  };

  // Helper to normalize guard difficulty text to match expected type
  const normalizeGuardDifficulty = (text: string): string => {
    if (!text) return text;
    if (text.includes("Removed a FEW")) return "Removed a FEW, kept most on";
    if (text.includes("Removed MOST")) return "Removed MOST, kept most on";
    if (text.includes("Removed all")) return "Removed ALL gutter guards";
    if (text.includes("Cleaned through")) return "Cleaned through them";
    return text;
  };

  // Helper to normalize downspout difficulty text to match expected type
  // Maps full descriptions to simple "Easy" | "Moderate" | "Hard"
  const normalizeDownspoutDifficulty = (text: string): string => {
    if (!text) return text;
    if (text.startsWith("Easy")) return "Easy";
    if (text.startsWith("Moderate")) return "Moderate";
    if (text.startsWith("Hard")) return "Hard";
    return text;
  };

  const gutterSectionPresent =
    get("Dirt / Debris level") ||
    get("Gutter guards?") ||
    get("How many downspouts were clogged?");

  const gutter = gutterSectionPresent
    ? {
        debrisLevel: get("Dirt / Debris level") as "Light" | "Medium" | "Heavy",
        guardsType: get("Gutter guards?") as
          | "No gutter guards"
          | "Clip in gutter guards"
          | "Screw in gutter guards",
        guardDifficulty: normalizeGuardDifficulty(
          get("How hard were gutter guards?")
        ) as
          | "No gutter guards"
          | "Cleaned through them"
          | "Removed a FEW, kept most on"
          | "Removed MOST, kept most on"
          | "Removed ALL gutter guards",
        downspoutsClogged: (get("How many downspouts were clogged?") ||
          "None") as "None" | "1" | "2" | "3" | "4" | "5+",
        downspoutDifficulty: normalizeDownspoutDifficulty(
          get("How hard was unclogging the downspouts?")
        ) as "Easy" | "Moderate" | "Hard",
        twoStoryLadderRequired: (get("Two story ladder required?") || "No") as
          | "Yes"
          | "No",
        debrisCleaned: (get("Did you clean up the debris?") || "No") as
          | "Yes"
          | "No",
        sentPhotosToCustomer: (get(
          "Did you send before/after photos to customer?"
        ) || "No") as "Yes" | "No",
      }
    : undefined;

  return {
    technicianName: get("Technician Name"),
    customerFirstName: get("Customer First Name"),
    jobTime: get("How long did YOU spend working on the job?"),
    paymentMethod: get("Payment Method") as
      | "Homebase"
      | "Link sent"
      | "Check"
      | "Not paid yet",
    services: getAllMultiSelect("Services Included") as (
      | "Gutter Cleaning"
      | "Window Cleaning"
      | "Solar Cleaning"
    )[],
    gutter,
    general: {
      scope: get("Scope? Number of solar panels, window panes, etc") || "",
      notes: get("General job notes") || "",
    },
  };
}
