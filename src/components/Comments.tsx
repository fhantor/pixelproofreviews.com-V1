'use client';

import { useState, useEffect } from 'react';

interface CommentsProps {
  postId: number;
}

interface WPComment {
  id: number;
  date: string;
  content: { rendered: string };
  author_name: string;
  author_url: string;
  parent: number;
}

export default function Comments({ postId }: CommentsProps) {
  const WP_API_URL = process.env.WORDPRESS_API_URL || 'https://pixelproofreviews.com';
  const WP_SITE_URL = WP_API_URL.replace('/wp-json/wp/v2', '');
  
  const [comments, setComments] = useState<WPComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [formData, setFormData] = useState({
    author_name: '',
    author_email: '',
    content: '',
  });

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(`${WP_API_URL}/wp-json/wp/v2/comments?post=${postId}&per_page=50&orderby=date&order=asc`);
        if (res.ok) {
          setComments(await res.json());
        }
      } catch {
        // Comments failed to load
      } finally {
        setLoading(false);
      }
    }
    fetchComments();
  }, [postId, WP_API_URL]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus('idle');

    try {
      const res = await fetch(`${WP_API_URL}/wp-json/wp/v2/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post: postId,
          author_name: formData.author_name,
          author_email: formData.author_email,
          content: formData.content,
        }),
      });

      if (res.ok) {
        setStatus('success');
        setStatusMessage('Comment submitted! It will appear after approval.');
        setFormData({ author_name: '', author_email: '', content: '' });
      } else {
        const error = await res.json();
        setStatus('error');
        setStatusMessage(error.message || 'Failed to submit comment. Please try again.');
      }
    } catch {
      setStatus('error');
      setStatusMessage('Failed to submit comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const topLevelComments = comments.filter((c) => c.parent === 0);
  const replies = comments.filter((c) => c.parent !== 0);

  return (
    <div className="mt-12 pt-8 border-t border-dark-100 dark:border-dark-800">
      <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-6">
        Comments {comments.length > 0 && `(${comments.length})`}
      </h2>

      {/* Comment Form */}
      <div className="bg-dark-50 dark:bg-dark-900 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">Leave a Comment</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="author_name" className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="author_name"
                required
                value={formData.author_name}
                onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-dark-100 placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="author_email" className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="author_email"
                required
                value={formData.author_email}
                onChange={(e) => setFormData({ ...formData, author_email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-dark-100 placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                placeholder="your@email.com"
              />
              <p className="text-xs text-dark-400 mt-1">Your email will not be published.</p>
            </div>
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">
              Comment <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              required
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-dark-100 placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none"
              placeholder="Write your comment..."
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium text-sm transition-colors"
          >
            {submitting ? 'Submitting...' : 'Post Comment'}
          </button>
        </form>

        {status === 'success' && (
          <div className="mt-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm">
            {statusMessage}
          </div>
        )}
        {status === 'error' && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
            {statusMessage}
          </div>
        )}
      </div>

      {/* Existing Comments */}
      {loading ? (
        <div className="text-center py-8 text-dark-400">Loading comments...</div>
      ) : topLevelComments.length === 0 && comments.length === 0 ? (
        <div className="text-center py-8 bg-dark-50 dark:bg-dark-900 rounded-xl">
          <p className="text-dark-500 dark:text-dark-400 text-lg">No comments yet.</p>
          <p className="text-dark-400 dark:text-dark-500 text-sm mt-2">Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {topLevelComments.map((comment) => {
            const commentReplies = replies.filter((r) => r.parent === comment.id);
            return (
              <div key={comment.id} className="bg-dark-50 dark:bg-dark-900 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                      {comment.author_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-dark-900 dark:text-white">
                      {comment.author_url ? (
                        <a href={comment.author_url} target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                          {comment.author_name}
                        </a>
                      ) : (
                        comment.author_name
                      )}
                    </span>
                    <p className="text-xs text-dark-400">
                      {new Date(comment.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div
                  className="text-dark-600 dark:text-dark-400 text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: comment.content.rendered }}
                />

                {commentReplies.length > 0 && (
                  <div className="mt-4 ml-8 space-y-4">
                    {commentReplies.map((reply) => (
                      <div key={reply.id} className="bg-white dark:bg-dark-800 rounded-lg p-4 border border-dark-100 dark:border-dark-700">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                              {reply.author_name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-dark-900 dark:text-white">
                              {reply.author_url ? (
                                <a href={reply.author_url} target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                                  {reply.author_name}
                                </a>
                              ) : (
                                reply.author_name
                              )}
                            </span>
                            <p className="text-xs text-dark-400">
                              {new Date(reply.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <div
                          className="text-dark-600 dark:text-dark-400 text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none"
                          dangerouslySetInnerHTML={{ __html: reply.content.rendered }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
