import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    locale,
    routePath: "/privacy",
    title:
      locale === "ru"
        ? "Политика конфиденциальности | JetSet Travel Кипр"
        : "Privacy Policy | JetSet Travel Cyprus",
    description:
      locale === "ru"
        ? "Как JetSet K&K Travel Ltd собирает, использует и защищает ваши персональные данные в соответствии с GDPR."
        : "How JetSet K&K Travel Ltd collects, uses, and protects your personal data in accordance with GDPR.",
  });
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("privacy");

  if (locale === "ru") {
    return (
      <>
        <section className="bg-brand-navy text-white py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              {t("title")}
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              {t("lastUpdated")}
            </p>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none text-brand-navy/80">
              <p className="text-xl text-brand-navy/60 italic">
                {t("translationPending")}
              </p>
              <p className="mt-6">
                {t("translationContact")}{" "}
                <a
                  href="mailto:info@jetset.com.cy"
                  className="text-brand-gold hover:underline"
                >
                  info@jetset.com.cy
                </a>
              </p>
              <div className="mt-8">
                <Link
                  href={`/${locale}/privacy`}
                  className="text-brand-gold hover:underline font-semibold"
                >
                  {t("viewEnglish")}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-navy text-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            {t("title")}
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            {t("lastUpdated")}
          </p>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none text-brand-navy/80 [&_h2]:text-brand-navy [&_h2]:font-display [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-bold [&_h2]:mt-12 [&_h2]:mb-4 [&_h3]:text-brand-navy [&_h3]:font-semibold [&_h3]:text-xl [&_h3]:mt-8 [&_h3]:mb-3 [&_a]:text-brand-gold [&_a]:hover:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2">
            {/* 1. Data Controller */}
            <h2>1. Data Controller</h2>
            <p>
              The data controller responsible for your personal data is:
            </p>
            <p>
              <strong>JetSet K&amp;K Travel Ltd</strong>
              <br />
              26A Agapinoros Street, 8049 Paphos, Cyprus
              <br />
              Company Registration: HE 181550
              <br />
              Email:{" "}
              <a href="mailto:info@jetset.com.cy">info@jetset.com.cy</a>
              <br />
              Phone:{" "}
              <a href="tel:+35799478073">+357 99 478 073</a>
            </p>
            <p>
              JetSet K&amp;K Travel Ltd is an IATA-accredited travel agency
              (IATA code: 14200130), licensed by the Cyprus Tourism Organisation
              (Licence No. 7775).
            </p>

            {/* 2. What Data We Collect */}
            <h2>2. What Data We Collect</h2>
            <p>
              Depending on the services you use, we may collect the following
              categories of personal data:
            </p>
            <ul>
              <li>
                <strong>Identity data:</strong> full name, date of birth,
                nationality
              </li>
              <li>
                <strong>Contact data:</strong> email address, phone number,
                postal address
              </li>
              <li>
                <strong>Travel preferences:</strong> destination preferences,
                travel dates, seating and accommodation preferences
              </li>
              <li>
                <strong>Identity documents:</strong> passport or ID details
                (required for visa services and certain bookings)
              </li>
              <li>
                <strong>Payment information:</strong> payment card details,
                billing address (processed securely through third-party payment
                providers)
              </li>
              <li>
                <strong>Technical data:</strong> IP address, browser type and
                version, device information, pages visited on our website
              </li>
              <li>
                <strong>Cookies and tracking data:</strong> session cookies,
                analytics data, and preference cookies (see Section 10 below)
              </li>
              <li>
                <strong>Communication data:</strong> records of correspondence
                via email, phone, WhatsApp, or contact forms
              </li>
            </ul>

            {/* 3. Why We Collect Your Data */}
            <h2>3. Why We Collect Your Data</h2>
            <p>We process your personal data for the following purposes:</p>
            <ul>
              <li>
                <strong>Booking fulfilment:</strong> to arrange flights, hotels,
                transfers, and other travel services you request
              </li>
              <li>
                <strong>Visa processing:</strong> to prepare and submit visa
                applications on your behalf, where instructed
              </li>
              <li>
                <strong>Customer communication:</strong> to respond to enquiries,
                send booking confirmations, and provide travel updates
              </li>
              <li>
                <strong>Marketing:</strong> to send promotional offers and travel
                deals, only with your prior consent
              </li>
              <li>
                <strong>Legal obligations:</strong> to comply with tax,
                accounting, and regulatory requirements applicable to travel
                agencies in Cyprus
              </li>
              <li>
                <strong>Service improvement:</strong> to analyse website usage
                and improve our services
              </li>
            </ul>

            {/* 4. Legal Basis for Processing */}
            <h2>4. Legal Basis for Processing</h2>
            <p>
              Under the General Data Protection Regulation (GDPR), we rely on
              the following legal bases:
            </p>
            <ul>
              <li>
                <strong>Contract performance:</strong> processing necessary to
                fulfil your travel booking or respond to your pre-contractual
                requests (Article 6(1)(b))
              </li>
              <li>
                <strong>Legitimate interests:</strong> processing necessary for
                our legitimate business interests, such as fraud prevention,
                service improvement, and internal administration (Article
                6(1)(f))
              </li>
              <li>
                <strong>Consent:</strong> where you have given explicit consent,
                such as for marketing communications (Article 6(1)(a)). You may
                withdraw consent at any time
              </li>
              <li>
                <strong>Legal obligation:</strong> where processing is required
                to comply with applicable law (Article 6(1)(c))
              </li>
            </ul>

            {/* 5. Who We Share Your Data With */}
            <h2>5. Who We Share Your Data With</h2>
            <p>
              We share your personal data only as necessary to provide the
              services you have requested. Recipients may include:
            </p>
            <ul>
              <li>
                <strong>Airlines and transport providers:</strong> to issue
                tickets and manage bookings
              </li>
              <li>
                <strong>Hotels and accommodation providers:</strong> to confirm
                reservations
              </li>
              <li>
                <strong>Visa authorities and consulates:</strong> to process visa
                applications on your behalf
              </li>
              <li>
                <strong>Payment processors:</strong> to securely process
                transactions
              </li>
              <li>
                <strong>IATA systems (e.g., GDS platforms):</strong> to access
                fare information and issue travel documents
              </li>
              <li>
                <strong>Insurance providers:</strong> where travel insurance is
                arranged
              </li>
            </ul>
            <p>
              We do not sell your personal data to third parties. All data
              sharing is limited to what is strictly necessary for service
              delivery.
            </p>

            {/* 6. International Data Transfers */}
            <h2>6. International Data Transfers</h2>
            <p>
              As a travel agency, we may need to transfer your personal data to
              travel providers, airlines, hotels, and authorities located outside
              the European Union / European Economic Area (EU/EEA). Such
              transfers may occur when:
            </p>
            <ul>
              <li>
                Booking flights or accommodation with providers based outside the
                EU/EEA
              </li>
              <li>
                Submitting visa applications to non-EU consulates or embassies
              </li>
              <li>
                Using global distribution systems (GDS) for fare searches and
                ticketing
              </li>
            </ul>
            <p>
              Where data is transferred outside the EU/EEA, we ensure
              appropriate safeguards are in place, which may include:
            </p>
            <ul>
              <li>
                European Commission adequacy decisions for the recipient country
              </li>
              <li>Standard Contractual Clauses (SCCs) approved by the EU</li>
              <li>
                The transfer being necessary for the performance of a contract
                between you and us (Article 49(1)(b) GDPR)
              </li>
            </ul>

            {/* 7. Data Retention */}
            <h2>7. Data Retention</h2>
            <p>We retain your personal data as follows:</p>
            <ul>
              <li>
                <strong>Booking records and invoices:</strong> retained for 7
                years from the date of the transaction, as required by Cyprus tax
                and commercial law
              </li>
              <li>
                <strong>Visa application data:</strong> retained for 7 years or
                as required by applicable regulations
              </li>
              <li>
                <strong>Marketing consent records:</strong> retained until you
                withdraw your consent
              </li>
              <li>
                <strong>Website analytics data:</strong> retained for up to 26
                months
              </li>
              <li>
                <strong>Contact form enquiries:</strong> retained for up to 2
                years unless a booking results
              </li>
            </ul>
            <p>
              After the applicable retention period, your data is securely
              deleted or anonymised.
            </p>

            {/* 8. Your Rights */}
            <h2>8. Your Rights Under GDPR</h2>
            <p>
              As a data subject, you have the following rights under the GDPR:
            </p>
            <ul>
              <li>
                <strong>Right of access:</strong> request a copy of the personal
                data we hold about you
              </li>
              <li>
                <strong>Right to rectification:</strong> request correction of
                inaccurate or incomplete data
              </li>
              <li>
                <strong>Right to erasure:</strong> request deletion of your
                personal data, subject to legal retention requirements
              </li>
              <li>
                <strong>Right to restriction:</strong> request that we limit the
                processing of your data in certain circumstances
              </li>
              <li>
                <strong>Right to data portability:</strong> receive your data in
                a structured, commonly used, machine-readable format
              </li>
              <li>
                <strong>Right to object:</strong> object to processing based on
                legitimate interests or direct marketing
              </li>
              <li>
                <strong>Right to withdraw consent:</strong> where processing is
                based on consent, you may withdraw it at any time without
                affecting the lawfulness of prior processing
              </li>
            </ul>

            {/* 9. How to Exercise Your Rights */}
            <h2>9. How to Exercise Your Rights</h2>
            <p>
              To exercise any of the rights described above, please contact us:
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a href="mailto:info@jetset.com.cy">info@jetset.com.cy</a>
              <br />
              <strong>Phone:</strong>{" "}
              <a href="tel:+35799478073">+357 99 478 073</a>
              <br />
              <strong>Post:</strong> JetSet K&amp;K Travel Ltd, 26A Agapinoros
              Street, 8049 Paphos, Cyprus
            </p>
            <p>
              We will respond to your request within 30 days. If we need
              additional time (up to 60 further days for complex requests), we
              will inform you within the initial 30-day period.
            </p>
            <p>
              If you are not satisfied with our response, you have the right to
              lodge a complaint with the{" "}
              <strong>
                Office of the Commissioner for Personal Data Protection
              </strong>{" "}
              of the Republic of Cyprus (
              <a
                href="https://www.dataprotection.gov.cy"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.dataprotection.gov.cy
              </a>
              ).
            </p>

            {/* 10. Cookies */}
            <h2>10. Cookies</h2>
            <p>
              Our website uses cookies and similar technologies to enhance your
              browsing experience. The types of cookies we use include:
            </p>
            <ul>
              <li>
                <strong>Essential cookies:</strong> required for the website to
                function correctly (e.g., session management, language
                preferences)
              </li>
              <li>
                <strong>Analytics cookies:</strong> help us understand how
                visitors interact with our website, so we can improve its
                performance and content
              </li>
              <li>
                <strong>Preference cookies:</strong> remember your settings and
                choices for a better user experience
              </li>
            </ul>
            <p>
              You can manage or disable cookies through your browser settings.
              Please note that disabling essential cookies may affect the
              functionality of our website.
            </p>

            {/* 11. Changes to This Policy */}
            <h2>11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect
              changes in our practices or applicable legislation. Any updates
              will be published on this page with a revised &quot;Last
              updated&quot; date. We encourage you to review this page
              periodically.
            </p>
            <p>
              For material changes that significantly affect how we process your
              data, we will make reasonable efforts to notify you via our website
              or by email.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
