import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-brand-gold px-5 py-3 font-semibold text-brand-navy transition-colors hover:bg-brand-gold/90 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}
