import type { YoastHeadJson } from '@/lib/types';

interface SchemaMarkupProps {
  yoastSchema?: YoastHeadJson['schema'];
  url: string; // pixelproofreviews.com/{slug} or pixelproofreviews.com/blog/{slug}
}

/**
 * Render Yoast schema.org JSON-LD with hostname swapped
 * from api.pixelproofreviews.com to pixelproofreviews.com.
 * Falls back to minimal WebSite/Article schema if no Yoast data.
 */
export default function SchemaMarkup({ yoastSchema, url }: SchemaMarkupProps) {
  let schema: unknown;

  if (yoastSchema) {
    // Deep clone and replace all api. domain refs
    const json = JSON.stringify(yoastSchema);
    schema = JSON.parse(json.replace(/https:\/\/api\.pixelproofreviews\.com/g, 'https://pixelproofreviews.com'));
  } else {
    // Fallback minimal schema
    schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': url,
          url,
        },
      ],
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
