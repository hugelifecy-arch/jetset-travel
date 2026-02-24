import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-brand-navy/20 px-4 py-3 text-sm text-brand-navy placeholder:text-brand-navy/40 outline-none transition-colors focus:border-brand-gold focus:ring-1 focus:ring-brand-gold",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-xl border border-brand-navy/20 px-4 py-3 text-sm text-brand-navy placeholder:text-brand-navy/40 outline-none transition-colors focus:border-brand-gold focus:ring-1 focus:ring-brand-gold",
        className,
      )}
      {...props}
    />
  );
}
