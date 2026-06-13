"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { hasConsent } from "@/lib/cookie-consent";

const counterId = process.env.NEXT_PUBLIC_YANDEX_METRICA_ID;

export default function YandexMetrica() {
  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    const check = () => setConsentGiven(hasConsent("analytics"));
    check();

    window.addEventListener("storage", check);
    window.addEventListener("cookie-consent-change", check);
    return () => {
      window.removeEventListener("storage", check);
      window.removeEventListener("cookie-consent-change", check);
    };
  }, []);

  if (!counterId || !consentGiven) return null;

  return (
    <>
      <link rel="dns-prefetch" href="https://mc.yandex.ru" />
      <Script id="yandex-metrica" strategy="afterInteractive">
        {`
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r)return;}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
          (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
          ym(${counterId}, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true });
        `}
      </Script>
      <noscript>
        <div>
          {/* No-JS tracking beacon — next/image does not apply here */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://mc.yandex.ru/watch/${counterId}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
