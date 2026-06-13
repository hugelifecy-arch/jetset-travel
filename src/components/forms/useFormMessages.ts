"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import type { FormMessages } from "./schemas";

/** Localized zod validation messages from the `forms` namespace. */
export function useFormMessages(): FormMessages {
  const t = useTranslations("forms");
  return useMemo(
    () => ({
      required: t("required"),
      invalidEmail: t("invalidEmail"),
    }),
    [t],
  );
}
