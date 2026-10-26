import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import {
  buildCtaLeadFormSchema,
  buildExitIntentSchema,
  type CTALeadFormValues,
  type ExitIntentFormValues,
  type FormMessages,
} from "./schemas";

/* Imported only through createLazyResolver (dynamic import): this module is
   what pulls zod into the browser, so no component may import it statically. */

export const ctaLeadFormResolver = (m: FormMessages): Resolver<CTALeadFormValues> =>
  zodResolver(buildCtaLeadFormSchema(m));

export const exitIntentResolver = (m: FormMessages): Resolver<ExitIntentFormValues> =>
  zodResolver(buildExitIntentSchema(m));
