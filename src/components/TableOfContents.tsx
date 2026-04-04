'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, List } from 'lucide-react';

interface TableOfContentsProps {
  headings: { id: string; text: string; level: number }[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (headings.length < 2) return null;

  return (
    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800/30 mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-2">
          <List className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h3 className="font-semibold text-dark-900 dark:text-white">Table of Contents</h3>
          <span className="text-xs text-dark-400 dark:text-dark-500">({headings.length} sections)</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-dark-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-dark-400" />
        )}
      </button>

      {isOpen && (
        <div className="px-4 pb-3">
          <nav className="space-y-0.5 max-h-64 overflow-y-auto">
            {headings.map((heading) => (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                className={`block py-1 text-xs transition-colors hover:text-purple-600 dark:hover:text-purple-400 ${
                  heading.level === 3
                    ? 'pl-5 text-dark-500 dark:text-dark-400'
                    : 'pl-1.5 font-medium text-dark-700 dark:text-dark-300'
                }`}
              >
                {heading.text}
              </a>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
