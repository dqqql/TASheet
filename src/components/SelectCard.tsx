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
    <div className="max-w-2xl mx-auto space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-muted">{label}</span>
        <select
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-ink focus:outline-none"
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
          className="rounded-xl p-5 border-l-4 space-y-3"
          style={{ backgroundColor: softColor, borderLeftColor: color }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
