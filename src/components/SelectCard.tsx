import type { ReactNode } from 'react';

interface Props<T extends string> {
  options: { id: T; nameZh: string; nameEn: string }[];
  value: T;
  onChange: (id: T) => void;
  color: string;
  softColor: string;
  label: string;
  children?: ReactNode;
}

export default function SelectCard<T extends string>({
  options, value, onChange, color, softColor, label, children,
}: Props<T>) {
  return (
    <div className="agency-shell mx-auto max-w-3xl space-y-4 p-4 sm:p-5">
      <label className="grid gap-2 sm:grid-cols-[160px_1fr] sm:items-end">
        <span>
          <span className="agency-kicker">Classification</span>
          <span className="agency-title block text-base">{label}</span>
        </span>
        <select
          className="agency-input mt-0"
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
        >
          <option value="">-- 请选择 --</option>
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.nameZh} ({o.nameEn})
            </option>
          ))}
        </select>
      </label>
      {children && (
        <div
          className="space-y-3 border p-4 sm:p-5"
          style={{ backgroundColor: softColor, borderColor: color }}
        >
          <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: color }}>
            <span
              className="inline-flex h-7 w-7 items-center justify-center text-sm font-black text-white"
              style={{ backgroundColor: color, clipPath: 'polygon(50% 0, 100% 100%, 0 100%)' }}
            >
              !
            </span>
            <span className="text-[10px] font-black uppercase" style={{ color }}>
              Active Agency File
            </span>
          </div>
          {children}
        </div>
      )}
    </div>
  );
}
