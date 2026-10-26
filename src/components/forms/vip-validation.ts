import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { z } from "zod";
import { FLIGHT_NUMBER_PATTERN, VIP_AIRPORTS, VIP_SERVICES } from "@/lib/quote-constants";

/* VIP airport request schema. Loaded only through createLazyResolver
   (dynamic import) so zod stays out of the /quote and /vip-services route
   chunks that Next.js prefetches; VipAirportForm imports the type only. */

type Messages = { required: string; invalidEmail: string; flightNumberInvalid: string };

const buildVipSchema = (m: Messages) =>
  z.object({
    name: z.string().trim().min(2, m.required).max(80),
    email: z.string().trim().email(m.invalidEmail).max(120),
    phone: z.string().trim().min(5, m.required).max(30),
    airport: z.enum(VIP_AIRPORTS, { message: m.required }),
    service: z.enum(VIP_SERVICES, { message: m.required }),
    date: z.string().trim().min(1, m.required).max(80),
    flightNumber: z
      .string()
      .trim()
      .max(12, m.flightNumberInvalid)
      .regex(FLIGHT_NUMBER_PATTERN, m.flightNumberInvalid)
      .optional(),
    passengers: z.string().trim().min(1, m.required).max(20),
    notes: z.string().trim().max(2000).optional(),
  });

export type VipFormData = z.infer<ReturnType<typeof buildVipSchema>>;

export const vipResolver = (m: Messages): Resolver<VipFormData> =>
  zodResolver(buildVipSchema(m));
