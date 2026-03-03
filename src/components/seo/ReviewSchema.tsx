import JsonLd from "./JsonLd";

interface ReviewData {
  author: string;
  reviewBody: string;
  ratingValue: number;
}

export default function ReviewSchema({ reviews }: { reviews: ReviewData[] }) {
  const schema = reviews.map((review) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "TravelAgency",
      name: "JetSet Travel Cyprus",
      url: "https://www.jetset-travel.com",
    },
    author: {
      "@type": "Person",
      name: review.author,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.ratingValue,
      bestRating: 5,
    },
    reviewBody: review.reviewBody,
    publisher: {
      "@type": "Organization",
      name: "Google Reviews",
    },
  }));

  return (
    <>
      {schema.map((s, i) => (
        <JsonLd key={i} data={s} />
      ))}
    </>
  );
}
