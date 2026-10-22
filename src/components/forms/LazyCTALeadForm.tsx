"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

/* The homepage enquiry form sits at the bottom of the page. Its code
   (react-hook-form, zod, the schema) is fetched only when the visitor scrolls
   within ~600px of it, so it no longer competes with the hero on slow phones.
   The placeholder reserves roughly the form's height to avoid a layout jump. */
const CTALeadForm = dynamic(() => import("./CTALeadForm"), { ssr: false });

export default function LazyCTALeadForm() {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={near ? undefined : "min-h-[900px] sm:min-h-[670px]"}>
      {near && <CTALeadForm />}
    </div>
  );
}
