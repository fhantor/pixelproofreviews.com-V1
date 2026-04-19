import { getCategories } from '@/lib/wordpress';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  alternates: {
    canonical: '/privacy-policy',
  },
};

export default async function PrivacyPolicyPage() {
  const categories = await getCategories().catch(() => []);

  const sections = [
    {
      title: '1. Information We Collect',
      content: 'We collect information about you in the following ways:',
      items: [
        '**Personal Data**: Information you provide voluntarily, such as your name and email address, when you sign up for a newsletter, submit a form, or contact us.',
        '**Derivative Data**: Information automatically collected when you visit the Site, including your IP address, browser type, operating system, and pages viewed.',
        '**Mobile Device Data**: If you access the Site via a mobile device, we may collect device-specific information like your device ID or location.',
      ],
    },
    {
      title: '2. How We Use Your Information',
      content: 'We use your information to improve your experience and manage the Site. This includes:',
      items: [
        'Sending newsletters or promotional offers (if you opt in).',
        'Delivering targeted ads or content.',
        'Analyzing usage trends to enhance the Site.',
        'Responding to your inquiries or support requests.',
      ],
    },
    {
      title: '3. Disclosure of Your Information',
      content: 'We may share your information in these situations:',
      items: [
        '**Third-Party Service Providers**: With trusted partners who assist with services like email delivery, hosting, or analytics.',
        '**Affiliate Partners**: With partners to track referrals or commissions (if applicable).',
        '**Legal Obligations**: When required by law or to protect our rights, safety, or property.',
      ],
    },
    {
      title: '4. Tracking Technologies',
      content: 'We use cookies and similar tools to improve your experience. These may:',
      items: [
        'Track your interactions with the Site.',
        'Support affiliate link functionality.',
      ],
      extra: 'You can manage cookies through your browser settings, though this may affect some Site features. Learn more at [aboutads.info/choices](http://www.aboutads.info/choices/).',
    },
    {
      title: '5. Third-Party Websites',
      content: 'The Site may contain links to external websites. This Privacy Policy does not apply to those sites, and we encourage you to review their privacy policies.',
    },
    {
      title: '6. Security of Your Information',
      content: 'We take reasonable steps to protect your data with technical and administrative safeguards. However, no online system is completely secure, and we cannot guarantee absolute protection.',
    },
    {
      title: '7. Your Rights',
      content: 'You have the following rights regarding your data:',
      items: [
        'Access the personal information we hold about you.',
        'Request corrections or deletion of your data.',
        'Opt out of marketing communications by contacting us or using the unsubscribe link in emails.',
      ],
      extra: 'To exercise these rights, please contact us using the details below.',
    },
    {
      title: '8. Changes to This Privacy Policy',
      content: 'We may update this policy from time to time. Any changes will be posted here with a new "Last Updated" date. Please check back regularly.',
    },
    {
      title: '9. Contact Us',
      content: 'If you have questions or concerns about this Privacy Policy, please reach out to us at:',
      items: [
        '**Email**: contact@pixelproofreviews.com',
        '**Website**: https://pixelproofreviews.com',
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header categories={categories} />
      
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
            Privacy Policy
          </h1>
          <p className="text-purple-200">Last Updated: March 18, 2024</p>
        </div>
      </section>

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-dark-600 dark:text-dark-400 mb-8 leading-relaxed">
            At <strong className="text-dark-900 dark:text-dark-100">Pixelproofreviews.com</strong>, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, share, and safeguard your data when you visit https://pixelproofreviews.com/ (the &apos;Site&apos;). Please read this policy carefully. If you do not agree with its terms, please do not use the Site.
          </p>

          <div className="space-y-8">
            {sections.map((section, index) => (
              <div key={index} className={index > 0 ? 'pt-8 border-t border-dark-100 dark:border-dark-800' : ''}>
                <h2 className="text-xl font-semibold text-dark-900 dark:text-white mb-4">
                  {section.title}
                </h2>
                <p className="text-dark-600 dark:text-dark-400 mb-4 leading-relaxed">
                  {section.content}
                </p>
                {section.items && (
                  <ul className="space-y-3 mb-4">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-dark-600 dark:text-dark-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                        <span className="leading-relaxed" dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-dark-800 dark:text-dark-200">$1</strong>') }} />
                      </li>
                    ))}
                  </ul>
                )}
                {section.extra && (
                  <p className="text-dark-500 dark:text-dark-500 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: section.extra.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-purple-600 dark:text-purple-400 hover:underline">$1</a>') }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
