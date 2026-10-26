import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { z } from "zod";

/* Contact form schema. Imported at runtime only through createLazyResolver
   (dynamic import), so zod is not part of the /contact route chunk that
   Next.js prefetches from the home page's hero and header links. */

type Translate = (key: string) => string;

function createContactSchema(t: Translate) {
  return z.object({
    name: z.string().min(2, t("nameMinLength")),
    email: z.string().email(t("invalidEmail")),
    phone: z.string().min(8, t("phoneRequired")),
    companyName: z.string().optional(),
    travelType: z.string().optional(),
    contactMethod: z.string().optional(),
    message: z.string().optional(),
  });
}

export type ContactFormData = z.infer<ReturnType<typeof createContactSchema>>;

export const contactResolver = (t: Translate): Resolver<ContactFormData> =>
  zodResolver(createContactSchema(t));
