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
      <h2 className="text-lg font-bold text-ink">Step 3 · 选择现实 R</h2>
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
              <h3 className="font-bold text-reality text-base">
                {data.nameZh}（{data.nameEn}）
              </h3>
              <p className="mt-1 whitespace-pre-line text-ink/80">{data.intro}</p>
            </div>

            {data.special && (
              <div className="bg-white/60 rounded-lg p-4 border border-reality/20">
                <p className="font-medium text-reality text-xs mb-1">特殊</p>
                <p className="whitespace-pre-line text-ink/80">{data.special}</p>
              </div>
            )}

            <div className="bg-white/60 rounded-lg p-4 space-y-1 border border-reality/20">
              <p className="font-medium text-reality text-xs">现实触发器 · {data.triggerName}</p>
              <p className="whitespace-pre-line text-ink/80">{data.triggerEffect}</p>
            </div>

            <div className="bg-white/60 rounded-lg p-4 space-y-1 border border-reality/20">
              <p className="font-medium text-reality text-xs">过载释放 · {data.overloadReleaseName}</p>
              <p className="text-ink/80">{data.overloadReleaseEffect}</p>
            </div>

            {data.personalQuestion && (
              <div className="bg-white/60 rounded-lg p-4 border border-reality/20">
                <p className="font-medium text-ink text-xs mb-1">{data.personalQuestion}</p>
                {data.personalQuestionHint && (
                  <p className="text-xs text-muted mb-2 whitespace-pre-line">{data.personalQuestionHint}</p>
                )}
                <textarea
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs focus:border-reality focus:outline-none"
                  rows={2}
                  value={specialAnswer}
                  onChange={(e) => onSpecialAnswer(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-3">
              <p className="font-medium text-reality text-xs">现实问答</p>
              {data.onboardingQuestions.map((q, i) => (
                <div key={i} className="bg-white/60 rounded-lg p-3 border border-reality/20">
                  <p className="text-xs font-medium text-ink mb-1">{i + 1}. {q}</p>
                  <textarea
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs focus:border-reality focus:outline-none"
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
