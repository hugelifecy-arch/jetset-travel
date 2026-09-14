import { z } from "zod";

export function createPrivateEnquirySchema(messages: {
  required: string;
  invalidEmail: string;
  invalidPhone: string;
}) {
  return z.object({
    name: z.string().trim().min(2, messages.required).max(80),
    organisation: z.string().trim().max(120).optional(),
    email: z.string().trim().email(messages.invalidEmail).max(120),
    phone: z.string().trim().max(30).optional(),
    contactMethod: z.enum(["phone", "email", "whatsapp"], { message: messages.required }),
    message: z.string().trim().max(2000).optional(),
  }).superRefine((data, ctx) => {
    if (data.contactMethod === "email" && !data.phone) return;
    if (!data.phone || !/^\+?[\d\s().-]+$/.test(data.phone) ||
      data.phone.replace(/\D/g, "").length < 7 || data.phone.replace(/\D/g, "").length > 15) {
      ctx.addIssue({ code: "custom", path: ["phone"], message: messages.invalidPhone });
    }
  });
}
