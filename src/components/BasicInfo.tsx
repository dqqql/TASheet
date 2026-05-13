interface Props {
  characterName: string;
  pronouns: string;
  agencyTitle: string;
  agencyRank: string;
  commendations: string;
  reprimands: string;
  extraOverload: string;
  onChange: (field: string, value: string) => void;
}

export default function BasicInfo(props: Props) {
  const { onChange } = props;
  const get = (key: string): string => {
    if (key in props) return (props as unknown as Record<string, string>)[key];
    return '';
  };
  return (
    <div className="max-w-md mx-auto space-y-5">
      <h2 className="text-lg font-bold text-ink">Step 1 · 基础信息</h2>
      {([
        ['角色姓名', 'characterName', '例如：林晨'],
        ['人称代词', 'pronouns', '例如：他/她/TA'],
        ['机构头衔', 'agencyTitle', '例如：高级专员'],
        ['机构评级', 'agencyRank', '例如：7'],
      ]).map(([label, key, placeholder]) => (
        <label key={key} className="block">
          <span className="text-sm font-medium text-muted">{label}</span>
          <input
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-ink focus:outline-none"
            value={get(key)}
            onChange={(e) => onChange(key, e.target.value)}
            placeholder={placeholder}
          />
        </label>
      ))}
      <div className="grid grid-cols-3 gap-3">
        {([
          ['嘉奖', 'commendations', '0'],
          ['申诫', 'reprimands', '0'],
          ['额外过载', 'extraOverload', '0'],
        ]).map(([label, key, placeholder]) => (
          <label key={key} className="block">
            <span className="text-sm font-medium text-muted">{label}</span>
            <input
              className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-ink focus:outline-none"
              value={get(key)}
              onChange={(e) => onChange(key, e.target.value)}
              placeholder={placeholder}
            />
          </label>
        ))}
      </div>
    </div>
  );
}
