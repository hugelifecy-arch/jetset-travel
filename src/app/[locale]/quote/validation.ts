import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { z } from "zod";
import { TRIP_TYPES } from "@/lib/quote-constants";

/* Schemas for the two quote forms. Imported at runtime only through
   createLazyResolver (dynamic import), so zod is not part of the /quote
   route chunk that Next.js prefetches from the home page. The forms import
   the data types with `import type` (erased at build time). */

type Messages = { required: string; invalidEmail: string };
type LuxuryMessages = Messages & { tripTypes: string };

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

/* Luxury trip request (3-step wizard). tripTypes is step 1; the wizard
   validates one step's fields at a time with trigger(). */
const buildLuxurySchema = (m: LuxuryMessages) =>
  z.object({
    tripTypes: z.array(z.enum(TRIP_TYPES)).min(1, m.tripTypes).max(TRIP_TYPES.length),
    destinations: z.string().trim().min(2, m.required).max(200),
    dates: z.string().trim().min(1, m.required).max(80),
    groupSize: z.string().trim().min(1, m.required).max(50),
    budget: z.string().min(1, m.required),
    name: z.string().trim().min(2, m.required).max(80),
    email: z.string().trim().email(m.invalidEmail).max(120),
    phone: z.string().trim().min(5, m.required).max(30),
    specialRequirements: z.string().trim().max(2000).optional(),
  });

export type LuxuryFormData = z.infer<ReturnType<typeof buildLuxurySchema>>;

export const corporateResolver = (m: Messages): Resolver<CorporateFormData> =>
  zodResolver(buildCorporateSchema(m));

export const luxuryResolver = (m: LuxuryMessages): Resolver<LuxuryFormData> =>
  zodResolver(buildLuxurySchema(m));
