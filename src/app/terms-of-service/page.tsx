import { getCategories } from '@/lib/wordpress';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  alternates: {
    canonical: '/terms-of-service',
  },
};

export default async function TermsOfServicePage() {
  const categories = await getCategories().catch(() => []);

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: 'By using the Site, you confirm that you are at least 18 years old and have the legal capacity to agree to these Terms. If you are using the Site on behalf of an organization, you confirm that you have the authority to bind that organization to these Terms.',
    },
    {
      title: '2. Changes to Terms',
      content: 'We may update these Terms at any time. Changes will take effect immediately upon posting the updated Terms on the Site. Your continued use of the Site after changes are posted means you accept the new Terms. Please check these Terms regularly for updates.',
    },
    {
      title: '3. Use of the Site',
      content: 'You agree to use the Site only for lawful purposes and in a way that does not harm or interfere with others\' use of the Site. You must not:',
      items: [
        'Engage in illegal, harmful, or fraudulent activities.',
        'Distribute spam, malware, or other harmful content.',
        'Attempt to access the Site or its systems without permission.',
        'Disrupt the Site\'s functionality.',
      ],
    },
    {
      title: '4. Affiliate Marketing and Links',
      content: '**Pixelproofreviews.com** participates in affiliate marketing programs. We may earn commissions if you click on or buy products through affiliate links on the Site. These relationships are disclosed in our Affiliate Disclosure, available on the Site.',
      extra: 'We aim to provide accurate and current information about the products we review, but we do not guarantee its accuracy, completeness, or reliability. You use this information at your own risk. We are not responsible for the products or services offered by third parties. Any dealings with these vendors are between you and them, and we are not liable for those interactions.',
    },
    {
      title: '5. Intellectual Property',
      content: 'All content on the Site, including text, graphics, logos, images, and software, belongs to **Pixelproofreviews.com** or its licensors and is protected by copyright, trademark, and other intellectual property laws. You may not copy, share, or modify any content from the Site without our written permission.',
    },
    {
      title: '6. Disclaimers',
      content: 'The Site and its content are provided "as is" without any warranties, express or implied, including warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not guarantee that the Site will always work, be error-free, or be free of viruses or harmful elements.',
      extra: 'We make no promises about the products or services we review. Any choices you make based on our content are your responsibility.',
    },
    {
      title: '7. Limitation of Liability',
      content: 'To the fullest extent allowed by law, Pixel Proof Reviews is not liable for any direct, indirect, incidental, consequential, or punitive damages from your use of the Site or its content. This includes losses like lost profits or data, even if we were warned of the possibility.',
    },
    {
      title: '8. Indemnification',
      content: 'You agree to protect and hold harmless **Pixelproofreviews.com**, its affiliates, and their officers, directors, employees, and agents from any claims, liabilities, damages, or costs (including legal fees) arising from your use of the Site or breach of these Terms.',
    },
    {
      title: '9. Governing Law',
      content: 'These Terms are governed by the laws of California. Any disputes related to these Terms will be resolved in the courts of Los Angeles County.',
    },
    {
      title: '10. Termination',
      content: 'We can suspend or end your access to the Site at any time, without notice, for any reason, including if we believe you\'ve violated these Terms.',
    },
    {
      title: '11. Contact Us',
      content: 'If you have questions about these Terms, please reach out to us at: **contact@pixelproofreviews.com**.',
    },
    {
      title: '12. Entire Agreement',
      content: 'These Terms are the full agreement between you and **Pixelproofreviews.com** about your use of the Site. They replace any earlier agreements, written or oral.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header categories={categories} />
      
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
            Terms of Service
          </h1>
          <p className="text-purple-200">Last Updated: March 18, 2024</p>
        </div>
      </section>

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-dark-600 dark:text-dark-400 mb-8 leading-relaxed">
            Welcome to <strong className="text-dark-900 dark:text-dark-100">Pixelproofreviews.com</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). These Terms of Service (&quot;Terms&quot;) govern your use of our website, https://pixelproofreviews.com (the &quot;Site&quot;), and any content, services, or features provided through the Site. By accessing or using the Site, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use the Site.
          </p>

          <div className="space-y-8">
            {sections.map((section, index) => (
              <div key={index} className={index > 0 ? 'pt-8 border-t border-dark-100 dark:border-dark-800' : ''}>
                <h2 className="text-xl font-semibold text-dark-900 dark:text-white mb-4">
                  {section.title}
                </h2>
                <p className="text-dark-600 dark:text-dark-400 mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: section.content.replace(/\*\*(.*?)\*\*/g, '<strong class="text-dark-800 dark:text-dark-200">$1</strong>') }} />
                {section.items && (
                  <ul className="space-y-3 mb-4">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-dark-600 dark:text-dark-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {section.extra && (
                  <p className="text-dark-500 dark:text-dark-500 text-sm leading-relaxed">{section.extra}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-dark-100 dark:border-dark-800">
            <p className="text-dark-700 dark:text-dark-300 font-semibold">Pixel Proof Reviews</p>
            <ul className="mt-2 space-y-1 text-sm text-dark-500 dark:text-dark-400">
              <li><strong className="text-dark-700 dark:text-dark-300">Email</strong>: contact@pixelproofreviews.com</li>
              <li><strong className="text-dark-700 dark:text-dark-300">Website</strong>: https://pixelproofreviews.com</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
