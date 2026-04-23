/**
 * Generate structured data for a review post.
 * Includes Product, Review, and AggregateRating schema.
 */
export function generateReviewSchema({
  postId,
  title,
  excerpt,
  url,
  imageUrl,
  datePublished,
  dateModified,
  author,
}: {
  postId: number;
  title: string;
  excerpt: string;
  url: string;
  imageUrl?: string;
  datePublished: string;
  dateModified?: string;
  author: string;
}) {
  // Deterministic rating based on postId (matches QualityMeter logic)
  const ratings = [4.5, 4.6, 4.7, 4.8, 4.9];
  const ratingValue = ratings[postId % ratings.length];

  const schema: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'Review',
      '@id': `${url}#review`,
      headline: `Review: ${title}`,
      description: excerpt.slice(0, 300),
      url,
      datePublished,
      ...(dateModified ? { dateModified } : {}),
      author: {
        '@type': 'Person',
        name: author,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Pixel Proof Reviews',
        url: 'https://www.pixelproofreviews.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.pixelproofreviews.com/favicon.svg',
        },
      },
      reviewRating: {
        '@type': 'Rating',
        bestRating: 5,
        ratingValue,
      },
      itemReviewed: {
        '@type': 'Product',
        '@id': `${url}#product`,
        name: title,
        url,
        ...(imageUrl
          ? {
              image: imageUrl,
            }
          : {}),
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue,
          bestRating: 5,
          reviewCount: 1,
        },
      },
    },
  ];

  return schema;
}
