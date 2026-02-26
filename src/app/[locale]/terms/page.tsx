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
    routePath: "/terms",
    title:
      locale === "ru"
        ? "Условия обслуживания и бронирования | JetSet Travel Cyprus"
        : "Terms of Service & Booking Conditions | JetSet Travel Cyprus",
    description:
      locale === "ru"
        ? "Условия бронирования, оплаты, отмены и ответственности JetSet K&K Travel Ltd."
        : "Booking conditions, payment terms, cancellation policy, and liability for services provided by JetSet K&K Travel Ltd.",
  });
}

export default async function TermsOfServicePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("terms");

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
                  href="/en/terms"
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

      {/* Terms Content */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none text-brand-navy/80 [&_h2]:text-brand-navy [&_h2]:font-display [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-bold [&_h2]:mt-12 [&_h2]:mb-4 [&_h3]:text-brand-navy [&_h3]:font-semibold [&_h3]:text-xl [&_h3]:mt-8 [&_h3]:mb-3 [&_a]:text-brand-gold [&_a]:hover:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2">

            {/* 1. Introduction */}
            <h2>1. Introduction</h2>
            <p>
              These Terms of Service (&quot;Terms&quot;) govern your use of the
              website{" "}
              <a
                href="https://www.jetset-travel.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.jetset-travel.com
              </a>{" "}
              and the travel services provided by{" "}
              <strong>JetSet K&amp;K Travel Ltd</strong>. By accessing our
              website or engaging our services, you agree to be bound by these
              Terms.
            </p>
            <p>
              JetSet K&amp;K Travel Ltd is a licensed travel agency registered
              in Cyprus (Company Registration: HE 181550), holding Cyprus
              Tourism Organisation Licence No.&nbsp;7775 and IATA Accreditation
              No.&nbsp;14200130.
            </p>

            {/* 2. Definitions */}
            <h2>2. Definitions</h2>
            <ul>
              <li>
                <strong>&quot;We&quot; / &quot;Us&quot; / &quot;Our&quot;</strong>{" "}
                means JetSet K&amp;K Travel Ltd, 26A Agapinoros Street, 8049
                Paphos, Cyprus.
              </li>
              <li>
                <strong>&quot;You&quot; / &quot;Client&quot;</strong> means the
                individual or entity making a booking or enquiry with us.
              </li>
              <li>
                <strong>&quot;Services&quot;</strong> means travel bookings,
                flight ticketing, hotel reservations, visa assistance,
                corporate travel management, luxury travel planning, and any
                other services we provide.
              </li>
              <li>
                <strong>&quot;Supplier&quot;</strong> means any third-party
                provider whose services we arrange on your behalf, including
                airlines, hotels, transfer operators, and tour operators.
              </li>
              <li>
                <strong>&quot;Booking Confirmation&quot;</strong> means the
                written confirmation we issue once a booking is accepted and
                the required payment received.
              </li>
            </ul>

            {/* 3. Booking & Confirmation */}
            <h2>3. Booking &amp; Confirmation</h2>
            <p>
              A booking is not confirmed until we have issued a written
              Booking Confirmation to you by email. We reserve the right to
              decline any booking at our discretion.
            </p>
            <p>
              Bookings are confirmed upon:
            </p>
            <ul>
              <li>Receipt of the required deposit or full payment (as
              applicable); and</li>
              <li>Our written Booking Confirmation sent to the email address
              you provide.</li>
            </ul>
            <p>
              It is your responsibility to check all details in the Booking
              Confirmation carefully and notify us immediately of any errors.
              We cannot accept liability for mistakes not reported within
              24 hours of receiving the confirmation.
            </p>

            {/* 4. Pricing & Payment */}
            <h2>4. Pricing &amp; Payment</h2>
            <p>
              All prices quoted are subject to availability at the time of
              booking and may change before a booking is confirmed. Prices are
              quoted in the currency specified at the time of enquiry.
            </p>
            <p>We accept payment by:</p>
            <ul>
              <li>Bank transfer (SEPA or international wire)</li>
              <li>Credit or debit card (subject to applicable processing fees)</li>
            </ul>
            <p>
              Full payment must be received before travel documents (such as
              e-tickets, hotel vouchers, or visa paperwork) are issued to you.
              For some bookings a deposit may be accepted, with the balance due
              by the date specified in your Booking Confirmation. Failure to pay
              the balance by the due date may result in cancellation of the
              booking.
            </p>

            {/* 5. Changes & Cancellation by Client */}
            <h2>5. Changes &amp; Cancellation by Client</h2>
            <p>
              All requests to change or cancel a confirmed booking must be made
              in writing (email is acceptable). Changes are subject to
              availability and may incur additional charges from suppliers.
            </p>
            <p>
              Cancellation fees are calculated based on the number of days
              before the travel departure date on which we receive your written
              cancellation notice:
            </p>
            <ul>
              <li>
                <strong>30 days or more before departure:</strong> administration
                fee only (to cover our processing costs)
              </li>
              <li>
                <strong>14–29 days before departure:</strong> 50% of the total
                booking value
              </li>
              <li>
                <strong>Under 14 days before departure:</strong> 100% of the
                total booking value (no refund)
              </li>
            </ul>
            <p>
              Please note that some suppliers (particularly airlines, certain
              hotels, and tour operators) impose their own, more restrictive
              cancellation conditions. Where supplier terms differ from the
              above, the more restrictive terms will apply. We will advise you
              of any specific supplier cancellation policies at the time of
              booking.
            </p>

            {/* 6. Changes & Cancellation by Us */}
            <h2>6. Changes &amp; Cancellation by Us</h2>
            <p>
              We reserve the right to cancel or modify a confirmed booking in
              the following circumstances:
            </p>
            <ul>
              <li>
                Force majeure events, including but not limited to natural
                disasters, acts of terrorism, war, epidemics, government
                travel restrictions, or other events beyond our reasonable
                control
              </li>
              <li>
                Supplier cancellations, insolvency, or material changes to
                the services booked
              </li>
              <li>
                Failure to receive full payment by the agreed due date
              </li>
            </ul>
            <p>
              If we cancel a booking for reasons within our control (excluding
              force majeure and supplier failures), we will offer you either a
              full refund of all amounts paid to us, or an alternative booking
              of equivalent value where possible.
            </p>
            <p>
              In the event of force majeure or supplier cancellation, we will
              endeavour to recover funds on your behalf but cannot guarantee a
              full refund where suppliers do not return monies paid.
            </p>

            {/* 7. Travel Documents & Visas */}
            <h2>7. Travel Documents &amp; Visas</h2>
            <p>
              It is your sole responsibility to ensure that you hold a valid
              passport and any other travel documents required for your
              journey. Your passport must be valid for at least six months
              beyond the planned return date unless the destination country
              specifies otherwise.
            </p>
            <p>
              We can assist with visa applications as part of our visa services.
              However, <strong>visa decisions rest solely with the relevant
              consulate or immigration authority.</strong> We do not guarantee
              the granting of any visa, and we accept no liability for refused,
              delayed, or incorrectly processed visa applications where we have
              followed the application process in good faith.
            </p>
            <p>
              You must ensure that all personal details provided to us for
              visa and booking purposes are accurate and match your travel
              documents exactly.
            </p>

            {/* 8. Travel Insurance */}
            <h2>8. Travel Insurance</h2>
            <p>
              We strongly recommend that all clients obtain comprehensive travel
              insurance prior to travel. Suitable cover should include, at
              minimum:
            </p>
            <ul>
              <li>Trip cancellation and curtailment</li>
              <li>Medical expenses and emergency repatriation</li>
              <li>Baggage and personal effects</li>
              <li>Personal liability</li>
            </ul>
            <p>
              Travel insurance is not included in any of our quoted prices and
              remains the client&apos;s own responsibility to arrange. We are
              not authorised to sell insurance products.
            </p>

            {/* 9. Liability */}
            <h2>9. Liability</h2>
            <p>
              JetSet K&amp;K Travel Ltd acts as an intermediary between you and
              the travel suppliers whose services we arrange. We do not operate
              flights, hotels, transfers, or other travel products directly.
            </p>
            <p>
              Our liability to you in connection with any booking is limited to
              the total cost of the services booked through us. We are not
              liable for:
            </p>
            <ul>
              <li>
                Any failure, cancellation, delay, or change by a third-party
                supplier that is beyond our reasonable control
              </li>
              <li>
                Loss, damage, injury, or inconvenience arising from events of
                force majeure
              </li>
              <li>
                Indirect, consequential, or special losses, including lost
                profits, missed business opportunities, or additional travel
                expenses not directly caused by our error
              </li>
              <li>
                Errors in information provided by you (incorrect names, dates,
                or document details)
              </li>
            </ul>
            <p>
              Nothing in these Terms limits our liability for death or personal
              injury caused by our negligence, or for fraud or fraudulent
              misrepresentation.
            </p>

            {/* 10. Complaints */}
            <h2>10. Complaints</h2>
            <p>
              If you experience a problem during your travel, you should where
              possible raise it with the relevant supplier immediately so that
              they have the opportunity to resolve it.
            </p>
            <p>
              Any complaint about our services must be notified to us in writing
              within <strong>28 days</strong> of the end of your travel. Please
              send written complaints to:
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a href="mailto:info@jetset.com.cy">info@jetset.com.cy</a>
              <br />
              <strong>Post:</strong> JetSet K&amp;K Travel Ltd, 26A Agapinoros
              Street, 8049 Paphos, Cyprus
            </p>
            <p>
              We will acknowledge your complaint within 5 working days and
              provide a full written response within 28 days of receipt. We will
              investigate all complaints fairly and keep you informed of our
              progress.
            </p>

            {/* 11. Governing Law */}
            <h2>11. Governing Law</h2>
            <p>
              These Terms and any dispute or claim arising out of or in
              connection with them (including non-contractual disputes or claims)
              shall be governed by and construed in accordance with the laws of
              the <strong>Republic of Cyprus</strong>.
            </p>
            <p>
              Any disputes shall be subject to the exclusive jurisdiction of
              the courts of the Republic of Cyprus, without prejudice to your
              rights as a consumer under applicable EU law.
            </p>

            {/* 12. Contact */}
            <h2>12. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us:
            </p>
            <p>
              <strong>JetSet K&amp;K Travel Ltd</strong>
              <br />
              26A Agapinoros Street, 8049 Paphos, Cyprus
              <br />
              Cyprus Tourism Organisation Licence: 7775
              <br />
              IATA Accreditation: 14200130
              <br />
              Company Registration: HE 181550
              <br />
              Email:{" "}
              <a href="mailto:info@jetset.com.cy">info@jetset.com.cy</a>
              <br />
              Phone: <a href="tel:+35799478073">+357 99 478 073</a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
