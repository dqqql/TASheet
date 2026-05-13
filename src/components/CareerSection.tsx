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
  // Auto-fill defaults when career changes
  useEffect(() => {
    if (!data) return;
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
      <div className="mx-auto max-w-3xl">
        <p className="agency-kicker">Control Yourself</p>
        <h2 className="agency-title">Step 5 · 选择职能 C</h2>
      </div>
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
              <h3 className="text-base font-black text-career">
                {data.nameZh}（{data.nameEn}）
              </h3>
              <p className="mt-1 whitespace-pre-line text-ink/80">{data.intro}</p>
            </div>

            <div className="agency-section bg-white/80 space-y-1">
              <p className="text-[10px] font-black uppercase text-career">最高原则</p>
              <p className="text-base font-black text-ink">"{data.primeDirective}"</p>
              <p className="text-xs text-muted">{data.primeDirectiveEffect}</p>
            </div>

            <div className="agency-section bg-white/80 space-y-1">
              <p className="text-[10px] font-black uppercase text-career">授权行为</p>
              <ol className="list-decimal list-inside text-ink/80 space-y-0.5">
                {data.authorizedActions.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ol>
            </div>

            {data.specialQuestion && (
              <div className="agency-section bg-white/80">
                <p className="mb-1 text-xs font-bold text-ink">{data.specialQuestion}</p>
                <textarea
                  className="agency-textarea text-xs focus:border-career"
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
        <div className="agency-shell mx-auto max-w-3xl space-y-3 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="agency-kicker">Requisitions</p>
              <h3 className="agency-title text-base">申领物与福利</h3>
            </div>
            <button
              onClick={addRow}
              className="agency-button border-career bg-white text-career hover:bg-career-soft"
            >
              + 添加
            </button>
          </div>
          <p className="text-xs text-muted">
            选择职能后自动填入初始申领物及通用装备。可自行增删修改。
          </p>

          {requisitions.map((r, i) => (
            <div key={i} className="border border-stone-300 bg-white">
              <div className="grid grid-cols-[2fr_4fr_1fr] bg-career-soft text-xs font-bold text-career text-center">
                <div className="p-2 border-r border-career/20">名称</div>
                <div className="p-2 border-r border-career/20">效果</div>
                <div className="p-2">代码</div>
              </div>
              <div className="grid grid-cols-[2fr_4fr_1fr]">
                <input
                  className="border-r border-stone-200 p-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-career/20"
                  value={r.name}
                  onChange={(e) => updateRow(i, 'name', e.target.value)}
                />
                <textarea
                  className="resize-none overflow-hidden border-r border-stone-200 p-2 text-xs focus:outline-none focus:ring-2 focus:ring-career/20"
                  value={r.effect}
                  onChange={(e) => {
                    const el = e.target;
                    el.style.height = 'auto';
                    el.style.height = el.scrollHeight + 'px';
                    updateRow(i, 'effect', e.target.value);
                  }}
                  ref={(el) => {
                    if (el) {
                      el.style.height = 'auto';
                      el.style.height = el.scrollHeight + 'px';
                    }
                  }}
                />
                <div className="relative">
                  <input
                    className="w-full p-2 text-center text-xs focus:outline-none focus:ring-2 focus:ring-career/20"
                    value={r.code}
                    onChange={(e) => updateRow(i, 'code', e.target.value)}
                  />
                  <button
                    onClick={() => removeRow(i)}
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center border border-transparent text-xs text-red-400 hover:border-red-300 hover:text-red-600"
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
