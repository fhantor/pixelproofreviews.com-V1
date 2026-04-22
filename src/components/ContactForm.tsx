'use client';

import { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

interface ContactFormProps {
  className?: string;
}

export default function ContactForm({ className = '' }: ContactFormProps) {
  // Force rebuild after Vercel cache issue: JS bundle served stale /api/* URLs
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMsg('');

    try {
      const res = await fetch('https://api.pixelproofreviews.com/wp-json/pp/v1/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        setStatus('success');
        setMsg(data.msg || 'Thanks! Message sent.');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
        setMsg(data.msg || 'Failed to send. Please try again.');
      }
    } catch {
      setStatus('error');
      setMsg('Network error. Please try again.');
    }
  };

  const inputBase =
    'w-full px-4 py-2.5 rounded-lg border border-dark-200 dark:border-dark-700 ' +
    'bg-white dark:bg-dark-900 text-dark-900 dark:text-dark-100 ' +
    'placeholder:text-dark-400 dark:placeholder:text-dark-500 ' +
    'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ' +
    'text-sm transition-colors';

  return (
    <form onSubmit={handleSubmit} className={`space-y-5 ${className}`}>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={form.name}
          onChange={handleChange}
          placeholder="Your name"
          className={inputBase}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={form.email}
          onChange={handleChange}
          placeholder="your@email.com"
          className={inputBase}
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          required
          value={form.subject}
          onChange={handleChange}
          placeholder="What is this about?"
          className={inputBase}
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={form.message}
          onChange={handleChange}
          placeholder="What's on your mind?"
          className={`${inputBase} resize-none`}
        />
      </div>

      {status !== 'idle' && status !== 'loading' && (
        <div
          className={`flex items-center gap-2 text-sm ${
            status === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}
        >
          {status === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {msg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className={
          'w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg ' +
          'bg-purple-600 text-white font-medium text-sm transition-opacity ' +
          (status === 'loading' ? 'opacity-70 cursor-wait' : 'hover:opacity-90')
        }
      >
        <Send className="h-4 w-4" />
        {status === 'loading' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
