/**
 * Move keyboard focus to an element and bring it into view without the
 * browser's own focus scroll, which can leave it tucked under the sticky
 * header. Smooth scrolling only when the visitor has not asked for reduced
 * motion.
 */
export function focusAndReveal(
  focusTarget: HTMLElement | null | undefined,
  options: { scrollTarget?: HTMLElement | null; block?: ScrollLogicalPosition } = {},
): void {
  if (!focusTarget) return;
  focusTarget.focus({ preventScroll: true });
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  (options.scrollTarget ?? focusTarget).scrollIntoView({
    block: options.block ?? "center",
    behavior: reduce ? "auto" : "smooth",
  });
}
