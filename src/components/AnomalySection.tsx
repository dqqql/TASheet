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
      <h2 className="text-lg font-bold text-ink">Step 2 · 选择异常体 A</h2>
      <SelectCard
        options={options}
        value={value}
        onChange={onChange}
        color="#1F5EA8"
        softColor="#EAF2FB"
        label="异常共鸣类型"
      >
        {data && (
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-bold text-anomaly text-base">
                {data.nameZh}（{data.nameEn}）
              </h3>
              <p className="mt-1 whitespace-pre-line text-ink/80">{data.intro}</p>
            </div>

            <div className="space-y-4">
              {data.abilities.map((ab, i) => (
                <div key={i} className="bg-white/60 rounded-lg p-4 space-y-1.5 border border-anomaly-soft/50">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold bg-anomaly text-white px-2 py-0.5 rounded">
                      能力 {i + 1}
                    </span>
                    <span className="font-bold text-ink">{ab.name}</span>
                    <span className="text-xs text-muted ml-auto">资质：{ab.quality}</span>
                  </div>
                  <p><span className="font-medium text-anomaly">触发：</span>{ab.trigger}</p>
                  <p><span className="font-medium text-green-700">成功：</span>{ab.success}</p>
                  <p><span className="font-medium text-ink/70">增强：</span>{ab.enhancement}</p>
                  <p><span className="font-medium text-red-600">失败：</span>{ab.failure}</p>

                  <div className="mt-3 pt-3 border-t border-stone-200">
                    <p className="font-medium text-ink text-xs mb-1">{ab.question}</p>
                    <div className="flex gap-3">
                      {ab.answers.map((ans) => {
                        const sel = answers[ab.name] === ans.label;
                        return (
                          <button
                            key={ans.label}
                            onClick={() => onAnswer(ab.name, ans.label)}
                            className={
                              'text-left text-xs px-3 py-2 rounded-lg border transition ' +
                              (sel
                                ? 'border-anomaly bg-anomaly-soft font-medium'
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
