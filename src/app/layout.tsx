import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter, Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import ScrollToTop from '@/components/ScrollToTop';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-plus-jakarta' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });

export const metadata: Metadata = {
  title: 'Pixel Proof Reviews — Reviewing Products and Sharing Exclusive Offers',
  description: 'Detailed, unbiased reviews of digital tools and software, backed by hands-on experience and 12+ years of SEO expertise.',
  metadataBase: new URL('https://www.pixelproofreviews.com'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.svg',
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://www.pixelproofreviews.com/#website',
      url: 'https://www.pixelproofreviews.com',
      name: 'Pixel Proof Reviews',
      description: 'Reviewing Products and Sharing Exclusive Offers',
      inLanguage: 'en-US',
      publisher: {
        '@type': 'Organization',
        '@id': 'https://www.pixelproofreviews.com/#organization',
        name: 'Pixel Proof Reviews',
        url: 'https://www.pixelproofreviews.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.pixelproofreviews.com/favicon.svg',
        },
      },
      potentialAction: [
        {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://www.pixelproofreviews.com/search?q={search_term_string}',
          },
          'query-input': {
            '@type': 'PropertyValueSpecification',
            valueName: 'search_term_string',
          },
        },
      ],
    },
    {
      '@type': 'Organization',
      '@id': 'https://www.pixelproofreviews.com/#organization',
      name: 'Pixel Proof Reviews',
      url: 'https://www.pixelproofreviews.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.pixelproofreviews.com/favicon.svg',
      },
      sameAs: [
        'https://t.me/fhantor',
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="msvalidate.01" content="F3A680760E19CCEDD15D74F080649D00" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${inter.variable} ${plusJakarta.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-17BSYL85W4"
          strategy="afterInteractive"
        />
        <Script id="ga4" strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-17BSYL85W4');
            `,
          }}
        />
        <ThemeProvider>
          {children}
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
