import { getCategories } from '@/lib/wordpress';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default async function DisclaimerPage() {
  const categories = await getCategories().catch(() => []);

  const sections = [
    {
      title: '1. Affiliate Disclosure',
      content: '**Pixelproofreviews.com** participates in affiliate marketing programs. This means:',
      items: [
        'We may earn a commission if you click on or make purchases through affiliate links on the Site.',
        'These commissions come at **no additional cost** to you.',
        'Our affiliate relationships do not influence our content, reviews, or recommendations. We only promote products we believe in and strive to provide honest, unbiased information.',
      ],
    },
    {
      title: '2. Content Accuracy',
      content: 'The information on the Site is provided for general informational purposes only. While we make every effort to ensure the accuracy and reliability of our content:',
      items: [
        'We do not guarantee the completeness, accuracy, or timeliness of the information.',
        'The content is based on our research, opinions, and experiences at the time of publication and may change over time.',
        'We are not responsible for any errors, omissions, or outdated information.',
      ],
      extra: 'You acknowledge that any reliance on the information provided on the Site is at your own risk.',
    },
    {
      title: '3. User Responsibility',
      content: 'You are solely responsible for any decisions or actions you take based on the information on the Site. We strongly encourage you to:',
      items: [
        'Conduct your own research and due diligence before making any purchases or decisions.',
        'Verify the details of any product or service with the respective vendor.',
      ],
      extra: '**Pixelproofreviews.com** is not liable for any losses, damages, or negative outcomes resulting from your use of the Site or reliance on its content.',
    },
    {
      title: '4. Contact Us',
      content: 'If you have any questions or concerns about this disclaimer, please contact us at:',
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
            Disclaimer
          </h1>
          <p className="text-purple-200">Last Updated: March 18, 2024</p>
        </div>
      </section>

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-dark-600 dark:text-dark-400 mb-8 leading-relaxed">
            This disclaimer applies to all content on <strong className="text-dark-900 dark:text-dark-100">Pixelproofreviews.com</strong> (the &quot;Site&quot;), including but not limited to articles, reviews, recommendations, and any other materials. By using the Site, you agree to the terms outlined in this disclaimer. If you do not agree, please do not use the Site.
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
                        <span className="leading-relaxed" dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-dark-800 dark:text-dark-200">$1</strong>') }} />
                      </li>
                    ))}
                  </ul>
                )}
                {section.extra && (
                  <p className="text-dark-500 dark:text-dark-500 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: section.extra.replace(/\*\*(.*?)\*\*/g, '<strong class="text-dark-800 dark:text-dark-200">$1</strong>') }} />
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
