import type { Career, QualityName } from '../types/arc';
import { QUALITIES } from '../types/arc';

interface Props {
  career: Career | null;
  choices: Record<number, 'a' | 'b'>;
  onChoice: (qIndex: number, choice: 'a' | 'b') => void;
  scores: Record<QualityName, number>;
  onScoreChange: (q: QualityName, v: number) => void;
  onResetScores: (scores: Record<QualityName, number>) => void;
}

const Q_LABELS = ['一', '二', '三'];

export default function SelfAssessment({ career, choices, onChoice, scores, onScoreChange, onResetScores }: Props) {
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
    onResetScores(newScores as Record<QualityName, number>);
  };

  return (
    <div className="agency-shell mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
      <div className="border-b-2 border-ink pb-4">
        <p className="agency-kicker">Quality Assurance</p>
        <h2 className="agency-title">Step 6 · 资质</h2>
        <p className="mt-1 text-sm text-muted">
          回答职能相关的 3 道选择题，自动计算资质倾向。你也可以手动调整各项数值。
        </p>
      </div>

      {!career ? (
        <p className="border border-dashed border-ink/30 bg-white px-4 py-8 text-center text-sm text-muted">
          请先在 Step 5 中选择一个职能。
        </p>
      ) : (
        <>
          {/* Questions */}
          <div className="space-y-4">
            {career.selfAssessment.map((q, i) => {
              const sel = choices[i];
              return (
                <div key={i} className="agency-section space-y-3">
                  <p className="text-sm font-bold text-ink">
                    <span className="mr-2 bg-career px-2 py-1 text-[10px] font-black uppercase text-white">
                      问题 {Q_LABELS[i]}
                    </span>
                    {q.question}
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {q.options.map((opt) => {
                      const active = sel === opt.label;
                      return (
                        <button
                          key={opt.label}
                          onClick={() => onChoice(i, opt.label)}
                          className={
                            'agency-choice text-sm ' +
                            (active
                              ? 'border-career bg-career-soft font-bold'
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
            className="agency-button bg-career text-white hover:bg-career/90"
          >
            计算资质
          </button>

          {/* Quality sliders */}
          <div className="agency-section">
            <p className="mb-3 text-sm font-black text-ink">资质分配（可手动调整）</p>
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
