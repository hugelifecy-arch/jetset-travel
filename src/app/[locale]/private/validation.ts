import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import type { z } from "zod";
import { createPrivateEnquirySchema } from "@/lib/private-enquiry-schema";

/* Imported at runtime only through createLazyResolver (dynamic import), so
   zod is not part of the /private route chunk that Next.js prefetches from
   the header link on every page. The schema itself stays shared with the
   API route in lib/private-enquiry-schema.ts. */

export type PrivateFormData = z.infer<ReturnType<typeof createPrivateEnquirySchema>>;

export const privateEnquiryResolver = (
  messages: Parameters<typeof createPrivateEnquirySchema>[0],
): Resolver<PrivateFormData> => zodResolver(createPrivateEnquirySchema(messages));
