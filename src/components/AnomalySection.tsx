import type { Anomaly } from '../types/arc';
import SelectCard from './SelectCard';

interface Props {
  options: { id: string; nameZh: string; nameEn: string }[];
  value: string;
  onChange: (id: string) => void;
  data: Anomaly | null;
  answers: Record<string, 'a' | 'b'>;
  onAnswer: (abilityName: string, choice: 'a' | 'b') => void;
}

export default function AnomalySection({ options, value, onChange, data, answers, onAnswer }: Props) {
  return (
    <div className="space-y-6">
      <div className="mx-auto max-w-3xl">
        <p className="agency-kicker">Capture Anomalies</p>
        <h2 className="agency-title">Step 2 · 选择异常 A</h2>
      </div>
      <SelectCard
        options={options}
        value={value}
        onChange={onChange}
        color="#1F5EA8"
        softColor="#EAF2FB"
        label="异常类型"
      >
        {data && (
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="text-base font-black text-anomaly">
                {data.nameZh}（{data.nameEn}）
              </h3>
              <p className="mt-1 whitespace-pre-line text-ink/80">{data.intro}</p>
            </div>

            <div className="space-y-4">
              {data.abilities.map((ab, i) => (
                <div key={i} className="agency-section bg-white/80 space-y-2">
                  <div className="grid gap-2 border-b border-anomaly/20 pb-2 sm:grid-cols-[auto_1fr_auto] sm:items-center">
                    <span className="bg-anomaly px-2 py-1 text-[10px] font-black uppercase text-white">
                      Ability {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-black text-ink">{ab.name}</span>
                    <span className="text-xs font-bold text-muted">资质：{ab.quality}</span>
                  </div>
                  <p><span className="font-medium text-anomaly">触发：</span>{ab.trigger}</p>
                  <p><span className="font-medium text-green-700">成功：</span>{ab.success}</p>
                  <p><span className="font-medium text-ink/70">增强：</span>{ab.enhancement}</p>
                  <p><span className="font-medium text-red-600">失败：</span>{ab.failure}</p>

                  <div className="mt-3 pt-3 border-t border-stone-200">
                    <p className="mb-2 text-xs font-bold text-ink">{ab.question}</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {ab.answers.map((ans) => {
                        const sel = answers[ab.name] === ans.label;
                        return (
                          <button
                            key={ans.label}
                            onClick={() => onAnswer(ab.name, ans.label)}
                            className={
                              'agency-choice ' +
                              (sel
                                ? 'border-anomaly bg-anomaly-soft font-bold'
                                : 'border-stone-200 hover:border-stone-400 bg-white')
                            }
                          >
                            <span className="font-bold mr-1">{ans.label.toUpperCase()}.</span>
                            {ans.text}
                            <span className="ml-1 text-muted">[{ans.code}]</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </SelectCard>
    </div>
  );
}
