interface QualityMeterProps {
  postId: number;
}

function getPostRating(postId: number): number {
  const ratings = [4.5, 4.6, 4.7, 4.8, 4.9];
  return ratings[postId % ratings.length];
}

function getSubScores(postId: number, overallScore: number): { label: string; score: number }[] {
  const criteria = ['Value for Money', 'Features', 'Ease of Use', 'Customer Support'];

  // Generate sub-scores using deterministic hash
  const scores = criteria.map((_, i) => {
    const hash = ((postId * (i + 1) * 2654435761) >>> 0) / 4294967296;
    return 4.5 + hash * 0.4; // Range: 4.5 to 4.9
  });

  // Adjust to ensure average equals overallScore
  const currentAvg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const adjustment = overallScore - currentAvg;
  const adjustedScores = scores.map(s => Math.min(4.9, Math.max(4.5, parseFloat((s + adjustment).toFixed(1)))));

  return criteria.map((label, i) => ({ label, score: adjustedScores[i] }));
}

function getVerdict(score: number): { label: string; bg: string; text: string } {
  if (score >= 4.8) return { label: 'Outstanding', bg: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' };
  if (score >= 4.6) return { label: 'Excellent', bg: 'bg-green-500', text: 'text-green-600 dark:text-green-400' };
  return { label: 'Very Good', bg: 'bg-teal-500', text: 'text-teal-600 dark:text-teal-400' };
}

function getBarColor(score: number, min: number, max: number): string {
  const relative = max === min ? 1 : (score - min) / (max - min);
  if (relative >= 0.75) return 'from-emerald-400 to-emerald-500';
  if (relative >= 0.5) return 'from-green-400 to-emerald-400';
  if (relative >= 0.25) return 'from-teal-400 to-green-400';
  return 'from-cyan-400 to-teal-400';
}

export default function QualityMeter({ postId }: QualityMeterProps) {
  const overallScore = getPostRating(postId);
  const subScores = getSubScores(postId, overallScore);
  const verdict = getVerdict(overallScore);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - overallScore / 5);

  const scores = subScores.map(s => s.score);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);

  const icons: Record<string, string> = {
    'Value for Money': '💰',
    'Features': '⚡',
    'Ease of Use': '🎯',
    'Customer Support': '🛎️',
  };

  return (
    <div className="rounded-2xl border border-purple-200 dark:border-purple-800/40 overflow-hidden mb-8 shadow-md">
      {/* Header band */}
      <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-purple-700 px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <h3 className="font-semibold text-white text-sm tracking-wide uppercase">Review Scorecard</h3>
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${verdict.bg} text-white shadow-sm`}>
          {verdict.label}
        </span>
      </div>

      <div className="bg-white dark:bg-gray-900/60 p-5">
        {/* Overall score ring + stars */}
        <div className="flex items-center gap-5 mb-6">
          <div className="relative flex-shrink-0" style={{ width: 96, height: 96 }}>
            <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
              <circle cx="48" cy="48" r={radius} fill="none" stroke="currentColor" strokeWidth="8"
                className="text-purple-100 dark:text-purple-900/40" />
              <circle cx="48" cy="48" r={radius} fill="none"
                stroke="url(#qmGrad)" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={circumference} strokeDashoffset={dashOffset} />
              <defs>
                <linearGradient id="qmGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gray-900 dark:text-white leading-none">
                {overallScore.toFixed(1)}
              </span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">out of 5</span>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1.5">Overall Rating</p>
            <div className="flex items-center gap-0.5 mb-2">
              {[1, 2, 3, 4, 5].map(i => (
                <svg key={i} className={`w-4 h-4 ${i <= Math.round(overallScore) ? 'text-amber-400' : 'text-gray-200 dark:text-gray-700'}`}
                  fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className={`text-sm font-semibold ${verdict.text}`}>{verdict.label}</span>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Based on 4 criteria</p>
          </div>
        </div>

        {/* Sub-score bars */}
        <div className="space-y-4 border-t border-gray-100 dark:border-gray-800 pt-4">
          {subScores.map(({ label, score }) => {
            const barColor = getBarColor(score, minScore, maxScore);
            return (
              <div key={label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm" aria-hidden="true">{icons[label]}</span>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{label}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i}
                          className={`w-1.5 h-1.5 rounded-full ${i <= Math.round(score) ? 'bg-purple-500 dark:bg-purple-400' : 'bg-gray-200 dark:bg-gray-700'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 w-7 text-right tabular-nums">
                      {score.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-700`}
                    style={{ width: `${(score / 5) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
