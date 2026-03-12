import Accordion from "@/components/ui/Accordion";
import JsonLd from "@/components/seo/JsonLd";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title: string;
  items: FAQItem[];
  background?: "white" | "light";
}

export default function FAQSection({
  title,
  items,
  background = "white",
}: FAQSectionProps) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <section
        className={`py-16 sm:py-20 ${background === "light" ? "bg-brand-light" : "bg-white"}`}
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {title}
            </h2>
          </div>
          <Accordion items={items} />
        </div>
      </section>
      <JsonLd data={faqSchema} />
    </>
  );
}
