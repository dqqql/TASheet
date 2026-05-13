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
    <div className="agency-shell mx-auto max-w-3xl p-4 sm:p-6">
      <div className="mb-5 flex flex-col gap-3 border-b-2 border-ink pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="agency-kicker">Personnel Dossier</p>
          <h2 className="agency-title">Step 1 · 基础信息</h2>
        </div>
        <div className="border border-ink px-3 py-2 text-[10px] font-black uppercase text-career">
          Form ID / ARC-001
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {([
          ['角色姓名', 'characterName'],
          ['人称代词', 'pronouns'],
          ['机构头衔', 'agencyTitle'],
          ['机构评级', 'agencyRank'],
        ]).map(([label, key]) => (
          <label key={key} className="block">
            <span className="agency-label">{label}</span>
            <input
              className="agency-input"
              value={get(key)}
              onChange={(e) => onChange(key, e.target.value)}
            />
          </label>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 border-t border-ink/20 pt-5 sm:grid-cols-3">
        {([
          ['嘉奖', 'commendations'],
          ['申诫', 'reprimands'],
          ['额外过载', 'extraOverload'],
        ]).map(([label, key]) => (
          <label key={key} className="block">
            <span className="agency-label">{label}</span>
            <input
              className="agency-input text-center font-black tabular-nums"
              value={get(key)}
              onChange={(e) => onChange(key, e.target.value)}
            />
          </label>
        ))}
      </div>
    </div>
  );
}
