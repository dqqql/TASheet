import type { RelationshipEntry, RelationshipPrompt } from '../types/arc';
import { CONNECTION_REWARDS } from '../types/arc';

interface Props {
  prompts: RelationshipPrompt[];
  entries: RelationshipEntry[];
  onChange: (entries: RelationshipEntry[]) => void;
}

export default function RelationshipEditor({ prompts, entries, onChange }: Props) {
  const emptyEntry = (prompt = ''): RelationshipEntry => ({
    prompt,
    name: '',
    player: '',
    description: '',
    bondRewardId: '',
    bondBonus: '',
  });

  const patch = (i: number, changes: Partial<RelationshipEntry>) => {
    const next = [...entries];
    const current = next[i] || emptyEntry();
    next[i] = { ...current, ...changes };
    onChange(next);
  };

  const update = <K extends keyof RelationshipEntry>(i: number, field: K, value: RelationshipEntry[K]) => {
    patch(i, { [field]: value });
  };

  const selectReward = (i: number, rewardId: string) => {
    const reward = CONNECTION_REWARDS.find((item) => item.id === rewardId);
    patch(i, {
      bondRewardId: rewardId,
      bondBonus: rewardId === 'custom' ? '' : reward?.effect ?? '',
    });
  };

  return (
    <div className="agency-shell mx-auto max-w-3xl space-y-5 p-4 sm:p-6">
      <div className="border-b-2 border-ink pb-4">
        <p className="agency-kicker">Relationship Network</p>
        <h2 className="agency-title">Step 4 · 创建人际关系</h2>
        <p className="mt-1 text-sm text-muted">
          基于你选择的现实身份，填写以下三段关键人际关系。
        </p>
      </div>
      {prompts.length === 0 && (
        <p className="border border-dashed border-ink/30 bg-white px-4 py-8 text-center text-sm text-muted">
          请先在 Step 3 中选择一个现实身份。
        </p>
      )}
      <div className="space-y-4">
        {prompts.map((p, i) => {
          const e = entries[i] || emptyEntry(p.question);
          const rewardId = e.bondRewardId || (e.bondBonus ? 'custom' : '');
          return (
            <div key={i} className="agency-section space-y-3">
              <p className="text-sm font-bold text-ink">
                <span className="mr-2 bg-reality px-2 py-1 text-[10px] font-black uppercase text-white">
                  关系 {String(i + 1).padStart(2, '0')}
                </span>
                {p.question}
              </p>
              {p.examples.length > 0 && (
                <p className="text-xs text-muted">
                  示例：{p.examples.join('、')}
                </p>
              )}
              <div className="grid grid-cols-2 gap-2">
                <label className="block">
                  <span className="agency-label">姓名</span>
                  <input
                    className="agency-input"
                    value={e.name}
                    onChange={(ev) => update(i, 'name', ev.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="agency-label">扮演者（可选）</span>
                  <input
                    className="agency-input"
                    value={e.player}
                    onChange={(ev) => update(i, 'player', ev.target.value)}
                  />
                </label>
              </div>
              <label className="block">
                <span className="agency-label">关系描述</span>
                <textarea
                  className="agency-textarea"
                  rows={2}
                  value={e.description}
                  onChange={(ev) => update(i, 'description', ev.target.value)}
                />
              </label>
              <div className="space-y-3">
                <label className="block">
                  <span className="agency-label">连结加成</span>
                  <select
                    className="agency-input"
                    value={rewardId}
                    onChange={(ev) => selectReward(i, ev.target.value)}
                  >
                    <option value="">-- 请选择 --</option>
                    {CONNECTION_REWARDS.map((reward) => (
                      <option key={reward.id} value={reward.id}>
                        {reward.id === 'custom' ? reward.name : `${reward.id}. ${reward.name}`}
                      </option>
                    ))}
                  </select>
                </label>
                {rewardId === 'custom' && (
                  <label className="block">
                    <span className="agency-label">自定义连结加成</span>
                    <textarea
                      className="agency-textarea"
                      rows={2}
                      value={e.bondBonus ?? ''}
                      onChange={(ev) => update(i, 'bondBonus', ev.target.value)}
                    />
                  </label>
                )}
                {rewardId && rewardId !== 'custom' && (
                  <p className="border border-reality/30 bg-reality-soft p-3 text-xs leading-relaxed text-ink">
                    {e.bondBonus}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
