import Link from "next/link";
import { Diamond, Mail, Shield, Lock, CheckCircle, ArrowRight } from "lucide-react";
import { FaTelegram } from "react-icons/fa6";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative text-white mt-16 overflow-hidden" style={{ backgroundColor: '#0d0617' }}>

      {/* Mesh pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M0 0h1v40H0zm40 0h-1v40h1zM0 0v1h40V0zm0 40v-1h40v1z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      {/* Radial glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-purple-700/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top CTA strip */}
      <div className="relative border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                Stay ahead with honest reviews
              </h3>
              <p className="text-sm text-purple-300 mt-0.5">
                Join thousands of marketers who trust PixelProof Reviews.
              </p>
            </div>
            <Link
              href="/contact-me"
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-purple-900/50"
            >
              Get in Touch
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <div>
              <Link href="/" className="flex items-center gap-2.5 mb-4 group">
                <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-900/60 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Diamond className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                  Pixel<span className="text-purple-400">Proof</span> Reviews
                </span>
              </Link>
              <p className="text-purple-300/80 text-sm leading-relaxed max-w-sm">
                Honest, in-depth reviews of digital tools, software, themes, plugins, and marketing solutions — backed by real-world testing and 12+ years of SEO expertise.
              </p>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/5 border border-white/10 text-purple-300">
                <Shield className="w-3 h-3 text-green-400" />
                DMCA Protected
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/5 border border-white/10 text-purple-300">
                <Lock className="w-3 h-3 text-green-400" />
                Secure Browsing
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/5 border border-white/10 text-purple-300">
                <CheckCircle className="w-3 h-3 text-green-400" />
                Verified Reviews
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'Blog', href: '/blog' },
                { label: 'Contact', href: '/contact-me' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-purple-200/70 hover:text-white text-sm transition-colors duration-150 hover:translate-x-0.5 inline-block">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-5">Legal</h3>
            <ul className="space-y-3">
              {[
                { label: 'Privacy Policy', href: '/privacy-policy' },
                { label: 'Terms of Service', href: '/terms-of-service' },
                { label: 'Disclaimer', href: '/disclaimer' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-purple-200/70 hover:text-white text-sm transition-colors duration-150 hover:translate-x-0.5 inline-block">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-5">About Fahim</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-500/50 flex-shrink-0 ring-2 ring-purple-700/30">
                <Image
                  src="https://api.pixelproofreviews.com/wp-content/uploads/2025/05/f7d00a5a-7737-400a-893f-d56c343e1f9b_Original-1-e1758074373992.jpg"
                  alt="Fahim"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-sm text-white">Fahim</p>
                <p className="text-[11px] text-purple-400">SEO & Digital Marketing</p>
              </div>
            </div>
            <p className="text-purple-300/70 text-xs leading-relaxed mb-4">
              12+ years in SEO. I test and evaluate software with a team of four reviewers so you don't have to guess.
            </p>
            <div className="flex gap-2">
              <a
                href="mailto:contact@pixelproofreviews.com"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-purple-600 hover:border-purple-500 transition-all duration-200"
                title="Email"
              >
                <Mail className="h-3.5 w-3.5 text-purple-300" />
              </a>
              <a
                href="https://t.me/fhantor"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-purple-600 hover:border-purple-500 transition-all duration-200"
                title="Telegram"
              >
                <FaTelegram className="h-3.5 w-3.5 text-purple-300" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-purple-400/60">
          <p>&copy; {new Date().getFullYear()} Pixel Proof Reviews. All rights reserved.</p>
          <p className="text-purple-300/60">Built with ❤ for honest digital reviews</p>
        </div>
      </div>
    </footer>
  );
}
