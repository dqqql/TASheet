import type { Career, QualityName } from '../types/arc';
import { QUALITIES } from '../types/arc';

interface Props {
  career: Career | null;
  choices: Record<number, 'a' | 'b'>;
  onChoice: (qIndex: number, choice: 'a' | 'b') => void;
  scores: Record<QualityName, number>;
  onScoreChange: (q: QualityName, v: number) => void;
}

const Q_LABELS = ['一', '二', '三'];

export default function SelfAssessment({ career, choices, onChoice, scores, onScoreChange }: Props) {
  const recalcFromChoices = () => {
    if (!career) return;
    const newScores: Record<string, number> = {};
    for (const q of QUALITIES) newScores[q] = 0;
    career.selfAssessment.forEach((q, i) => {
      const c = choices[i];
      if (c) {
        const opt = q.options.find((o) => o.label === c);
        if (opt) newScores[opt.quality] = (newScores[opt.quality] || 0) + 3;
      }
    });
    for (const q of QUALITIES) onScoreChange(q, newScores[q]);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-lg font-bold text-ink">Step 5 · 自我评估</h2>
      <p className="text-sm text-muted -mt-3">
        回答职能相关的 3 道选择题，自动计算资质倾向。你也可以手动调整各项数值。
      </p>

      {!career ? (
        <p className="text-sm text-muted text-center py-8">请先在 Step 4 中选择一个职能。</p>
      ) : (
        <>
          {/* Questions */}
          <div className="space-y-4">
            {career.selfAssessment.map((q, i) => {
              const sel = choices[i];
              return (
                <div key={i} className="bg-white rounded-xl border border-stone-200 p-5 space-y-3">
                  <p className="text-sm font-medium text-ink">
                    <span className="text-career font-bold mr-1">问题 {Q_LABELS[i]}</span>
                    {q.question}
                  </p>
                  <div className="flex gap-3">
                    {q.options.map((opt) => {
                      const active = sel === opt.label;
                      return (
                        <button
                          key={opt.label}
                          onClick={() => onChoice(i, opt.label)}
                          className={
                            'flex-1 text-left text-sm px-4 py-3 rounded-lg border transition ' +
                            (active
                              ? 'border-career bg-career-soft font-medium'
                              : 'border-stone-200 hover:border-stone-400 bg-white')
                          }
                        >
                          <span className="font-bold mr-1 text-career">{opt.label.toUpperCase()}.</span>
                          {opt.text}
                          <span className="block text-xs text-muted mt-1">
                            +3 {opt.quality}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recalc button */}
          <button
            onClick={recalcFromChoices}
            className="px-4 py-2 bg-career text-white rounded-full text-sm font-medium hover:bg-career/90 transition"
          >
            根据回答重新计算资质
          </button>

          {/* Quality sliders */}
          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <p className="text-sm font-medium text-ink mb-3">资质分配（可手动调整）</p>
            <div className="grid grid-cols-3 gap-3">
              {QUALITIES.map((q) => (
                <div key={q} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-ink">{q}</span>
                    <span className="text-muted tabular-nums">{scores[q]}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={12}
                    value={scores[q]}
                    onChange={(e) => onScoreChange(q, Number(e.target.value))}
                    className="w-full h-1.5 accent-career"
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-muted mt-3">
              总计：{QUALITIES.reduce((s, q) => s + (scores[q] || 0), 0)} 点
            </p>
          </div>
        </>
      )}
    </div>
  );
}
