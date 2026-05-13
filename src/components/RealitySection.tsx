import type { Reality } from '../types/arc';
import SelectCard from './SelectCard';

interface Props {
  options: { id: string; nameZh: string; nameEn: string }[];
  value: string;
  onChange: (id: string) => void;
  data: Reality | null;
  specialAnswer: string;
  onSpecialAnswer: (v: string) => void;
  onboardingAnswers: string[];
  onOnboardingAnswer: (i: number, v: string) => void;
}

export default function RealitySection({
  options, value, onChange, data, specialAnswer, onSpecialAnswer,
  onboardingAnswers, onOnboardingAnswer,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="mx-auto max-w-3xl">
        <p className="agency-kicker">Stabilize Reality</p>
        <h2 className="agency-title">Step 3 · 选择现实 R</h2>
      </div>
      <SelectCard
        options={options}
        value={value}
        onChange={onChange}
        color="#E7A900"
        softColor="#FFF6DE"
        label="现实"
      >
        {data && (
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="text-base font-black text-reality">
                {data.nameZh}（{data.nameEn}）
              </h3>
              <p className="mt-1 whitespace-pre-line text-ink/80">{data.intro}</p>
            </div>

            {data.special && (
              <div className="agency-section bg-white/80">
                <p className="mb-1 text-[10px] font-black uppercase text-reality">特殊</p>
                <p className="whitespace-pre-line text-ink/80">{data.special}</p>
              </div>
            )}

            <div className="agency-section bg-white/80 space-y-1">
              <p className="text-[10px] font-black uppercase text-reality">现实触发器 · {data.triggerName}</p>
              <p className="whitespace-pre-line text-ink/80">{data.triggerEffect}</p>
            </div>

            <div className="agency-section bg-white/80 space-y-1">
              <p className="text-[10px] font-black uppercase text-reality">过载释放 · {data.overloadReleaseName}</p>
              <p className="text-ink/80">{data.overloadReleaseEffect}</p>
            </div>

            {data.personalQuestion && (
              <div className="agency-section bg-white/80">
                <p className="mb-1 text-xs font-bold text-ink">{data.personalQuestion}</p>
                {data.personalQuestionHint && (
                  <p className="text-xs text-muted mb-2 whitespace-pre-line">{data.personalQuestionHint}</p>
                )}
                <textarea
                  className="agency-textarea text-xs focus:border-reality"
                  rows={2}
                  value={specialAnswer}
                  onChange={(e) => onSpecialAnswer(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-3">
              <p className="agency-kicker text-reality">Reality Interview</p>
              {data.onboardingQuestions.map((q, i) => (
                <div key={i} className="agency-section-soft bg-white/80">
                  <p className="mb-1 text-xs font-bold text-ink">{String(i + 1).padStart(2, '0')} / {q}</p>
                  <textarea
                    className="agency-textarea text-xs focus:border-reality"
                    rows={2}
                    value={onboardingAnswers[i] || ''}
                    onChange={(e) => onOnboardingAnswer(i, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </SelectCard>
    </div>
  );
}
