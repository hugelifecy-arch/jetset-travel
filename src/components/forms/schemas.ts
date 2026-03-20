import { z } from "zod";

export const leadFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(8, "Valid phone/WhatsApp is required"),
  route: z.string().min(5, "Please provide route details"),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;

export const ctaLeadFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  travelType: z.string().optional(),
  dates: z.string().optional(),
  message: z.string().optional(),
  website: z.string().optional(),
});

export type CTALeadFormValues = z.infer<typeof ctaLeadFormSchema>;

export const exitIntentSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  travelType: z.enum(["Corporate", "Leisure", "Visa"]).optional(),
  website: z.string().optional(),
});

export type ExitIntentFormValues = z.infer<typeof exitIntentSchema>;
