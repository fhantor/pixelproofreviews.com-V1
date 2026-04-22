'use client';

import { useState } from 'react';
import { Bell, CheckCircle, AlertCircle } from 'lucide-react';

interface NewsletterSignupProps {
  className?: string;
}

export default function NewsletterSignup({ className = '' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    setMsg('');

    try {
      const res = await fetch('https://api.pixelproofreviews.com/wp-json/pp/v1/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus('success');
        setMsg(data.msg || 'Subscribed successfully!');
        setEmail('');
      } else {
        setStatus('error');
        setMsg(data.msg || 'Failed to subscribe. Please try again.');
      }
    } catch {
      setStatus('error');
      setMsg('Network error. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <input
        type="email"
        placeholder="your@email.com"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={status === 'loading'}
        className={
          'flex-1 min-w-0 px-3 py-2 rounded-lg bg-white dark:bg-dark-800 ' +
          'border border-purple-200 dark:border-purple-800/50 ' +
          'text-dark-900 dark:text-dark-100 ' +
          'placeholder:text-dark-400 dark:placeholder:text-dark-500 ' +
          'text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ' +
          'transition-opacity ' +
          (status === 'loading' ? 'opacity-75' : '')
        }
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className={
          'flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 ' +
          'rounded-lg bg-purple-600 dark:bg-purple-500 text-white ' +
          'font-semibold text-sm transition-opacity ' +
          (status === 'loading' ? 'opacity-70 cursor-wait' : 'hover:opacity-90')
        }
      >
        {status === 'loading' ? (
          '<>Sending...</>'
        ) : status === 'success' ? (
          <>
            <CheckCircle className="w-3.5 h-3.5" />
            Done
          </>
        ) : (
          <>
            <Bell className="w-3.5 h-3.5" />
            Subscribe
          </>
        )}
      </button>

      {status !== 'idle' && status !== 'loading' && (
        <p
          className={`text-[11px] mt-1 ${
            status === 'success'
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'
          }`}
        >
          {msg}
        </p>
      )}
    </form>
  );
}
