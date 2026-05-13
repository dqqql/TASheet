import { useEffect } from 'react';
import type { Career, RequisitionEntry } from '../types/arc';
import { GENERIC_REQUISITIONS } from '../types/arc';
import SelectCard from './SelectCard';

interface Props {
  options: { id: string; nameZh: string; nameEn: string }[];
  value: string;
  onChange: (id: string) => void;
  data: Career | null;
  specialAnswer: string;
  onSpecialAnswer: (v: string) => void;
  requisitions: RequisitionEntry[];
  onRequisitionsChange: (r: RequisitionEntry[]) => void;
}

export default function CareerSection({
  options, value, onChange, data, specialAnswer, onSpecialAnswer,
  requisitions, onRequisitionsChange,
}: Props) {
  // Auto-fill defaults when career changes and no custom entries exist yet
  useEffect(() => {
    if (!data || requisitions.length > 0) return;
    const defaults: RequisitionEntry[] = [
      { name: data.initialRequisition, effect: data.requisitionEffect, code: '' },
      ...GENERIC_REQUISITIONS,
    ];
    onRequisitionsChange(defaults);
  }, [data?.id]);

  const updateRow = (i: number, field: keyof RequisitionEntry, val: string) => {
    const next = [...requisitions];
    next[i] = { ...next[i], [field]: val };
    onRequisitionsChange(next);
  };

  const addRow = () => {
    onRequisitionsChange([...requisitions, { name: '', effect: '', code: '' }]);
  };

  const removeRow = (i: number) => {
    onRequisitionsChange(requisitions.filter((_, idx) => idx !== i));
  };

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

            {data.specialQuestion && (
              <div className="bg-white/60 rounded-lg p-4 border border-career/20">
                <p className="font-medium text-ink text-xs mb-1">{data.specialQuestion}</p>
                <textarea
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs focus:border-career focus:outline-none"
                  rows={2}
                  value={specialAnswer}
                  onChange={(e) => onSpecialAnswer(e.target.value)}
                />
              </div>
            )}
          </div>
        )}
      </SelectCard>

      {/* Editable requisitions table */}
      {data && (
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-ink">申领物与福利</h3>
            <button
              onClick={addRow}
              className="px-3 py-1 text-xs border border-career text-career rounded-full hover:bg-career-soft transition"
            >
              + 添加
            </button>
          </div>
          <p className="text-xs text-muted -mt-2">
            选择职能后自动填入初始申领物及通用装备。可自行增删修改。
          </p>

          {requisitions.map((r, i) => (
            <div key={i} className="bg-white rounded-xl border border-stone-200 overflow-hidden">
              <div className="grid grid-cols-[2fr_4fr_1fr] bg-career-soft text-xs font-bold text-career text-center">
                <div className="p-2 border-r border-career/20">名称</div>
                <div className="p-2 border-r border-career/20">效果</div>
                <div className="p-2">代码</div>
              </div>
              <div className="grid grid-cols-[2fr_4fr_1fr]">
                <input
                  className="p-2 border-r border-stone-100 text-sm text-center focus:outline-none"
                  value={r.name}
                  onChange={(e) => updateRow(i, 'name', e.target.value)}
                />
                <textarea
                  className="p-2 border-r border-stone-100 text-xs focus:outline-none resize-none"
                  rows={3}
                  value={r.effect}
                  onChange={(e) => updateRow(i, 'effect', e.target.value)}
                />
                <div className="relative">
                  <input
                    className="p-2 text-xs text-center focus:outline-none w-full"
                    value={r.code}
                    onChange={(e) => updateRow(i, 'code', e.target.value)}
                  />
                  <button
                    onClick={() => removeRow(i)}
                    className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center text-red-400 hover:text-red-600 text-xs"
                    title="删除"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
