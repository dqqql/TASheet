import type { Career } from '../types/arc';
import SelectCard from './SelectCard';

interface Props {
  options: { id: string; nameZh: string; nameEn: string }[];
  value: string;
  onChange: (id: string) => void;
  data: Career | null;
  specialAnswer: string;
  onSpecialAnswer: (v: string) => void;
}

export default function CareerSection({
  options, value, onChange, data, specialAnswer, onSpecialAnswer,
}: Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-ink">Step 5 · 选择职能 C</h2>
      <SelectCard
        options={options}
        value={value}
        onChange={onChange}
        color="#D21F3C"
        softColor="#FDE8ED"
        label="机构职能"
      >
        {data && (
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-bold text-career text-base">
                {data.nameZh}（{data.nameEn}）
              </h3>
              <p className="mt-1 whitespace-pre-line text-ink/80">{data.intro}</p>
            </div>

            <div className="bg-white/60 rounded-lg p-4 space-y-1 border border-career/20">
              <p className="font-medium text-career text-xs">最高原则</p>
              <p className="font-bold text-ink text-base">"{data.primeDirective}"</p>
              <p className="text-xs text-muted">{data.primeDirectiveEffect}</p>
            </div>

            <div className="bg-white/60 rounded-lg p-4 space-y-1 border border-career/20">
              <p className="font-medium text-career text-xs">授权行为</p>
              <ol className="list-decimal list-inside text-ink/80 space-y-0.5">
                {data.authorizedActions.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ol>
            </div>

            <div className="bg-white/60 rounded-lg p-4 space-y-1 border border-career/20">
              <p className="font-medium text-career text-xs">
                初始申领物 · {data.initialRequisition}
              </p>
              <p className="whitespace-pre-line text-ink/80">{data.requisitionEffect}</p>
            </div>

            {data.specialQuestion && (
              <div className="bg-white/60 rounded-lg p-4 border border-career/20">
                <p className="font-medium text-ink text-xs mb-1">{data.specialQuestion}</p>
                <textarea
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs focus:border-career focus:outline-none"
                  rows={2}
                  value={specialAnswer}
                  onChange={(e) => onSpecialAnswer(e.target.value)}
                  placeholder="在此填写……"
                />
              </div>
            )}
          </div>
        )}
      </SelectCard>
    </div>
  );
}
