// types/forms/JobCompletionForm.ts

/**
 * Raw Tally webhook payload shape.
 * Tally sends an object where each form field is inside data.fields[]
 * but we’ll normalize it into a clean structure for our internal use.
 */

export interface JobCompletionInput {
  technicianName: string;
  customerFirstName: string;
  jobTime: string; // e.g. "1:15", "45 min", etc.

  paymentMethod: "Homebase" | "Link sent" | "Check" | "Not paid yet";

  services: ("Gutter Cleaning" | "Window Cleaning" | "Solar Cleaning")[];

  // Optional — only filled if gutter cleaning was done
  gutter?: {
    debrisLevel: "Light" | "Medium" | "Heavy";
    guardsType:
      | "No gutter guards"
      | "Clip in gutter guards"
      | "Screw in gutter guards";
    guardDifficulty:
      | "No gutter guards"
      | "Cleaned through them"
      | "Removed a FEW, kept most on"
      | "Removed MOST, kept most on"
      | "Removed ALL gutter guards";
    downspoutsClogged: "None" | "1" | "2" | "3" | "4" | "5+";
    downspoutDifficulty: "Easy" | "Moderate" | "Hard";
    twoStoryLadderRequired: "Yes" | "No";
    debrisCleaned: "Yes" | "No";
    sentPhotosToCustomer: "Yes" | "No";
  };

  general: {
    scope: string; // “24 windows, 14 solar panels” etc
    notes: string;
  };

  // The original raw payload if needed for auditing/debugging
  _raw?: any;
}
