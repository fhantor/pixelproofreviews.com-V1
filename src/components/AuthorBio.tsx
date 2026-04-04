import { Mail } from 'lucide-react';
import { FaTelegram } from 'react-icons/fa6';

interface AuthorBioProps {
  className?: string;
}

export default function AuthorBio({ className = '' }: AuthorBioProps) {
  return (
    <div className={`bg-white dark:bg-dark-900 rounded-xl border border-dark-100 dark:border-dark-800 p-6 ${className}`}>
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-dark-900 dark:text-white">Fahim</h3>
          <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-2">Digital Marketing & SEO Expert</p>
          <p className="text-sm text-dark-500 dark:text-dark-400 leading-relaxed mb-3">
            SEO specialist with 12+ years of experience. Together with my team of four reviewers, I test and evaluate software and digital products to help you make informed decisions.
          </p>
          <div className="flex items-center gap-2">
            <a
              href="mailto:contact@pixelproofreviews.com"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
              title="Send me an email"
            >
              <Mail className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </a>
            <a
              href="https://t.me/fhantor"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
              title="Message me on Telegram"
            >
              <FaTelegram className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
