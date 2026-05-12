interface Props {
  characterName: string;
  pronouns: string;
  onChange: (field: 'characterName' | 'pronouns', value: string) => void;
}

export default function BasicInfo({ characterName, pronouns, onChange }: Props) {
  return (
    <div className="max-w-md mx-auto space-y-5">
      <h2 className="text-lg font-bold text-ink">Step 1 · 基础信息</h2>
      <label className="block">
        <span className="text-sm font-medium text-muted">角色姓名</span>
        <input
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-ink focus:outline-none"
          value={characterName}
          onChange={(e) => onChange('characterName', e.target.value)}
          placeholder="例如：林晨"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-muted">人称代词</span>
        <input
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-ink focus:outline-none"
          value={pronouns}
          onChange={(e) => onChange('pronouns', e.target.value)}
          placeholder="例如：他/她/TA"
        />
      </label>
    </div>
  );
}
