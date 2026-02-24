import { z } from "zod";

export const leadFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(8, "Valid phone/WhatsApp is required"),
  route: z.string().min(5, "Please provide route details"),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;
