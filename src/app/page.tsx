import { headers } from "next/headers";
import { permanentRedirect } from "next/navigation";

// Fallback: middleware normally 301-redirects "/" → "/<locale>/", so this
// page is only reached if middleware is bypassed (e.g. direct rendering).
export default async function RootPage() {
  const headersList = await headers();
  const acceptLang = headersList.get("accept-language") || "";
  const ruIndex = acceptLang.search(/\bru\b/i);
  const enIndex = acceptLang.search(/\ben\b/i);
  const locale =
    ruIndex !== -1 && (enIndex === -1 || ruIndex < enIndex) ? "ru" : "en";
  permanentRedirect(`/${locale}/`);
}
