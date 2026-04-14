import JsonLd from "./JsonLd";

interface ServiceSchemaProps {
  name: string;
  description: string;
  url: string;
  locale?: string;
  serviceType?: string;
}

export default function ServiceSchema({
  name,
  description,
  url,
  locale = "en",
  serviceType,
}: ServiceSchemaProps) {
  const isRussian = locale === "ru";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url,
    ...(serviceType && { serviceType }),
    provider: {
      "@id": "https://www.jetset-travel.com/#organization",
    },
    areaServed: [
      { "@type": "City", name: isRussian ? "Пафос" : "Paphos" },
      { "@type": "City", name: isRussian ? "Лимассол" : "Limassol" },
      { "@type": "City", name: isRussian ? "Никосия" : "Nicosia" },
      { "@type": "City", name: isRussian ? "Ларнака" : "Larnaca" },
      { "@type": "Country", name: isRussian ? "Кипр" : "Cyprus" },
    ],
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: "https://www.jetset-travel.com",
      servicePhone: "+357-99-478-073",
      availableLanguage: [
        { "@type": "Language", name: "English" },
        { "@type": "Language", name: "Russian" },
      ],
    },
  };

  return <JsonLd data={schema} />;
}
