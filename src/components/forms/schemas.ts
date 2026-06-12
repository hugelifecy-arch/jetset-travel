import { z } from "zod";

/**
 * Validation messages surface in the UI via react-hook-form, so they must be
 * localized. Schemas are built per-render from the `forms` message namespace
 * (see useFormMessages) instead of hardcoding English strings here.
 */
export interface FormMessages {
  /** e.g. "This field is required" */
  required: string;
  /** e.g. "Please enter a valid email address" */
  invalidEmail: string;
}

export const buildCtaLeadFormSchema = (m: FormMessages) =>
  z.object({
    name: z.string().min(2, m.required),
    email: z.string().email(m.invalidEmail),
    phone: z.string().optional(),
    travelType: z.string().optional(),
    travelers: z.string().optional(),
    urgency: z.string().optional(),
    budget: z.string().optional(),
    dates: z.string().optional(),
    message: z.string().optional(),
    website: z.string().optional(),
  });

export type CTALeadFormValues = z.infer<ReturnType<typeof buildCtaLeadFormSchema>>;

export const buildExitIntentSchema = (m: FormMessages) =>
  z.object({
    name: z.string().min(2, m.required),
    email: z.string().email(m.invalidEmail),
    travelType: z.enum(["Corporate", "Leisure", "Visa"]).optional(),
    website: z.string().optional(),
  });

export type ExitIntentFormValues = z.infer<ReturnType<typeof buildExitIntentSchema>>;
