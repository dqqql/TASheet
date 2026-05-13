import type { Reality } from '../types/arc';
import SelectCard from './SelectCard';

interface Props {
  options: { id: string; nameZh: string; nameEn: string }[];
  value: string;
  onChange: (id: string) => void;
  data: Reality | null;
}

export default function RealitySection({
  options, value, onChange, data,
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

            <p className="border border-reality/30 bg-white/70 p-3 text-xs font-bold text-reality">
              与该现实相关的补充问题会附加在下方入职问卷末尾。
            </p>
          </div>
        )}
      </SelectCard>
    </div>
  );
}
