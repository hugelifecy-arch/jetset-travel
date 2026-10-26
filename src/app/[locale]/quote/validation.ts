import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { z } from "zod";

/* Schemas for the two quote forms. Imported at runtime only through
   createLazyResolver (dynamic import), so zod is not part of the /quote
   route chunk that Next.js prefetches from the home page. The forms import
   the data types with `import type` (erased at build time). */

type Messages = { required: string; invalidEmail: string };

/* Validation messages come from the `forms` namespace so they localize;
   errors render directly under their field, so the generic strings stay
   unambiguous. */
const buildCorporateSchema = (m: Messages) =>
  z.object({
    companyName: z.string().min(2, m.required),
    email: z.string().email(m.invalidEmail),
    phone: z.string().min(5, m.required),
    travellers: z.string().min(1, m.required),
    travelDates: z.string().min(1, m.required),
    destinations: z.string().min(2, m.required),
    invoiceRequired: z.boolean(),
    notes: z.string().optional(),
  });

export type CorporateFormData = z.infer<ReturnType<typeof buildCorporateSchema>>;

const buildLuxurySchema = (m: Messages) =>
  z.object({
    name: z.string().min(2, m.required),
    email: z.string().email(m.invalidEmail),
    phone: z.string().min(5, m.required),
    destinations: z.string().min(2, m.required),
    dates: z.string().min(1, m.required),
    groupSize: z.string().min(1, m.required),
    budget: z.string().min(1, m.required),
    specialRequirements: z.string().optional(),
  });

export type LuxuryFormData = z.infer<ReturnType<typeof buildLuxurySchema>>;

export const corporateResolver = (m: Messages): Resolver<CorporateFormData> =>
  zodResolver(buildCorporateSchema(m));

export const luxuryResolver = (m: Messages): Resolver<LuxuryFormData> =>
  zodResolver(buildLuxurySchema(m));
