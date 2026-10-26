import type { FieldValues, Resolver } from "react-hook-form";

/**
 * A react-hook-form resolver whose validation code (zod and its resolver,
 * about 41 KB) is fetched the first time it is needed instead of with the
 * page.
 *
 * Why: every form used to import zod statically. Next.js prefetches the
 * routes behind visible links (the hero's /contact and /quote, the header's
 * /private), and prefetching a route downloads its client chunks, so zod
 * arrived on the home page at first load although no form was used
 * (Lighthouse: 41 KB, 100% unused).
 *
 * Usage: pass `load` (a dynamic import that builds the zod resolver), give
 * `resolver` to useForm and call `preload()` from the form's onFocus so the
 * code is usually there before the first submit. react-hook-form validates
 * on submit by default, so nothing is fetched until the visitor focuses a
 * field or submits.
 */
export function createLazyResolver<T extends FieldValues>(
  load: () => Promise<Resolver<T>>,
): { resolver: Resolver<T>; preload: () => void } {
  let pending: Promise<Resolver<T>> | null = null;

  const get = (): Promise<Resolver<T>> => {
    pending ??= load().catch((error: unknown) => {
      pending = null; // try again on the next focus or submit
      throw error;
    });
    return pending;
  };

  const resolver: Resolver<T> = async (values, context, options) => {
    let validate: Resolver<T>;
    try {
      validate = await get();
    } catch {
      // The validation code could not be fetched (offline, blocked). Let the
      // submission through: every API route validates the payload again.
      return { values, errors: {} };
    }
    return validate(values, context, options);
  };

  return {
    resolver,
    preload: () => {
      get().catch(() => {});
    },
  };
}
