import type { RelationshipEntry, RelationshipPrompt } from '../types/arc';

interface Props {
  prompts: RelationshipPrompt[];
  entries: RelationshipEntry[];
  onChange: (entries: RelationshipEntry[]) => void;
}

export default function RelationshipEditor({ prompts, entries, onChange }: Props) {
  const update = (i: number, field: keyof RelationshipEntry, value: string) => {
    const next = [...entries];
    next[i] = { ...next[i], [field]: value };
    onChange(next);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-lg font-bold text-ink">Step 4 · 创建人际关系</h2>
      <p className="text-sm text-muted -mt-3">
        基于你选择的现实身份，填写以下三段关键人际关系。
      </p>
      {prompts.length === 0 && (
        <p className="text-sm text-muted text-center py-8">请先在 Step 3 中选择一个现实身份。</p>
      )}
      <div className="space-y-4">
        {prompts.map((p, i) => {
          const e = entries[i] || { prompt: p.question, name: '', player: '', description: '' };
          return (
            <div key={i} className="bg-white rounded-xl border border-stone-200 p-5 space-y-3">
              <p className="text-sm font-medium text-ink">
                <span className="text-reality font-bold mr-1">关系 {i + 1}</span>
                {p.question}
              </p>
              {p.examples.length > 0 && (
                <p className="text-xs text-muted">
                  示例：{p.examples.join('、')}
                </p>
              )}
              <div className="grid grid-cols-2 gap-2">
                <label className="block">
                  <span className="text-xs text-muted">姓名</span>
                  <input
                    className="mt-0.5 w-full rounded-lg border border-stone-300 px-2 py-1.5 text-sm focus:border-ink focus:outline-none"
                    value={e.name}
                    onChange={(ev) => update(i, 'name', ev.target.value)}
                    placeholder="姓名"
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-muted">扮演者（可选）</span>
                  <input
                    className="mt-0.5 w-full rounded-lg border border-stone-300 px-2 py-1.5 text-sm focus:border-ink focus:outline-none"
                    value={e.player}
                    onChange={(ev) => update(i, 'player', ev.target.value)}
                    placeholder="玩家名"
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-xs text-muted">关系描述</span>
                <textarea
                  className="mt-0.5 w-full rounded-lg border border-stone-300 px-2 py-1.5 text-sm focus:border-ink focus:outline-none"
                  rows={2}
                  value={e.description}
                  onChange={(ev) => update(i, 'description', ev.target.value)}
                  placeholder="描述你们之间的关系……"
                />
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
