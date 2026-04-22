import { getCategories } from '@/lib/wordpress';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, Globe, Sparkles, Users } from 'lucide-react';
import { FaTelegram } from 'react-icons/fa6';
import ContactForm from '@/components/ContactForm';
import NewsletterSignup from '@/components/NewsletterSignup';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/contact-me',
  },
};

export default async function ContactPage() {
  const categories = await getCategories().catch(() => []);

  const quickConnect = [
    {
      icon: <Mail className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
      title: 'Email',
      description: 'For inquiries, collaborations, or feedback.',
      link: 'mailto:contact@pixelproofreviews.com',
      linkText: 'contact@pixelproofreviews.com',
    },
    {
      icon: <FaTelegram className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
      title: 'Telegram',
      description: 'Message me for quick conversations.',
      link: 'https://t.me/fhantor',
      linkText: '@fhantor',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header categories={categories} />
      
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
            Get In Touch
          </h1>
          <p className="text-lg text-purple-100 max-w-2xl mx-auto">
            Have a question, need advice, or want to share a suggestion? I&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <h2 className="text-xl font-semibold text-dark-900 dark:text-white mb-6">
                Send a Message
              </h2>
              <ContactForm />
            </div>

            {/* Quick Connect Sidebar */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold text-dark-900 dark:text-white mb-6">
                Quick Connect
              </h2>
              <div className="space-y-4">
                {quickConnect.map((method) => (
                  <a
                    key={method.title}
                    href={method.link}
                    target={method.title === 'Telegram' ? '_blank' : undefined}
                    rel={method.title === 'Telegram' ? 'noopener noreferrer' : undefined}
                    className="block p-5 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/30 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-800/40 flex items-center justify-center flex-shrink-0">
                        {method.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-dark-900 dark:text-white">
                          {method.title}
                        </h3>
                        <p className="text-sm text-dark-500 dark:text-dark-400 mt-0.5">
                          {method.description}
                        </p>
                        <span className="text-sm font-medium text-purple-600 dark:text-purple-400 mt-2 inline-flex items-center gap-1">
                          {method.linkText}
                          <Globe className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Newsletter CTA */}
              <div className="mt-8 relative overflow-hidden rounded-2xl border border-purple-200 dark:border-purple-800/60 bg-purple-50 dark:bg-[#120c24] shadow-md shadow-purple-100 dark:shadow-purple-950/50">
                <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-purple-400 to-pink-500" />
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-purple-600/10 dark:bg-purple-500/10 blur-2xl pointer-events-none" />
                <div className="relative p-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-800/40 text-purple-700 dark:text-purple-300 text-xs font-semibold mb-4 tracking-wide uppercase">
                    <Sparkles className="w-3 h-3" />
                    Weekly Newsletter
                  </div>
                  <h3 className="text-xl font-bold leading-snug mb-1 text-dark-900 dark:text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                    Stay Ahead of the Curve
                  </h3>
                  <p className="text-sm text-dark-500 dark:text-dark-400 leading-relaxed mb-5">
                    Honest reviews, exclusive deals, and expert tips — every Thursday. No spam, ever.
                  </p>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="flex -space-x-2">
                      {['F', 'A', 'M', 'R'].map((l, i) => (
                        <div key={i} className="w-7 h-7 rounded-full bg-purple-200 dark:bg-purple-700/60 border-2 border-purple-50 dark:border-[#120c24] flex items-center justify-center text-[10px] font-bold text-purple-700 dark:text-purple-200">
                          {l}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-dark-500 dark:text-dark-400">
                      <span className="font-semibold text-dark-800 dark:text-white">5,000+</span> readers joined
                    </span>
                  </div>
                  <NewsletterSignup />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}