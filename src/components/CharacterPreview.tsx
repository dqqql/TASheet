import type { Anomaly, Reality, Career, RelationshipEntry, QualityName } from '../types/arc';
import { QUALITIES } from '../types/arc';

interface Props {
  characterName: string;
  pronouns: string;
  anomaly: Anomaly | null;
  reality: Reality | null;
  career: Career | null;
  abilityAnswers: Record<string, 'a' | 'b'>;
  realitySpecialAnswer: string;
  careerSpecialAnswer: string;
  onboardingAnswers: string[];
  relationships: RelationshipEntry[];
  qualityScores: Record<QualityName, number>;
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-block text-xs font-bold px-2 py-0.5 rounded text-white"
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  );
}

function SectionTitle({ label, color }: { label: string; color: string }) {
  return (
    <h3
      className="text-sm font-bold mb-2 pb-1 border-b-2"
      style={{ borderColor: color, color }}
    >
      {label}
    </h3>
  );
}

export default function CharacterPreview({
  characterName, pronouns, anomaly, reality, career,
  abilityAnswers, realitySpecialAnswer, careerSpecialAnswer,
  onboardingAnswers, relationships, qualityScores,
}: Props) {
  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {/* Page 1: Overview + Anomaly */}
      <div className="print-page rounded-lg shadow-lg">
        {/* Header */}
        <div className="text-center mb-4 pb-3 border-b-2 border-ink">
          <h1 className="text-xl font-black tracking-wider text-ink">
            {characterName || '　'} {pronouns && `· ${pronouns}`}
          </h1>
          <div className="flex justify-center gap-2 mt-1.5">
            {anomaly && <Badge label={`A: ${anomaly.nameZh}`} color="#1F5EA8" />}
            {reality && <Badge label={`R: ${reality.nameZh}`} color="#E7A900" />}
            {career && <Badge label={`C: ${career.nameZh}`} color="#D21F3C" />}
          </div>
        </div>

        {/* Quality Scores */}
        <div className="mb-4 border border-stone-200 rounded p-3">
          <SectionTitle label="资质评估" color="#6B647C" />
          <div className="grid grid-cols-9 gap-1 text-center">
            {QUALITIES.map((q) => (
              <div key={q} className="bg-stone-50 rounded py-1.5">
                <div className="text-[10px] text-muted">{q}</div>
                <div className="text-sm font-bold text-ink">{qualityScores[q] || 0}</div>
              </div>
            ))}
          </div>
          <div className="text-right text-[10px] text-muted mt-1">
            总计：{QUALITIES.reduce((s, q) => s + (qualityScores[q] || 0), 0)} 点
          </div>
        </div>

        {/* Anomaly Section */}
        {anomaly && (
          <div className="mb-4">
            <SectionTitle label="异常共鸣" color="#1F5EA8" />
            <p className="text-xs whitespace-pre-line text-ink/80 mb-2">
              {anomaly.nameZh}（{anomaly.nameEn}）— {anomaly.intro.slice(0, 200)}……
            </p>
            <div className="space-y-2">
              {anomaly.abilities.map((ab, i) => {
                const ans = abilityAnswers[ab.name];
                return (
                  <div key={i} className="border border-stone-200 rounded p-2 text-xs space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-anomaly">{ab.name}</span>
                      <span className="text-muted">| 资质: {ab.quality}</span>
                      {ans && (
                        <span className="ml-auto text-[10px] bg-anomaly-soft text-anomaly px-1.5 rounded-full font-medium">
                          选 {ans.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <p><b className="text-anomaly">触发</b> {ab.trigger}</p>
                    <p><b className="text-green-700">成功</b> {ab.success}</p>
                    <p><b className="text-ink/70">增强</b> {ab.enhancement}</p>
                    <p><b className="text-red-600">失败</b> {ab.failure}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Reality Section */}
        {reality && (
          <div className="mb-4">
            <SectionTitle label="现实身份" color="#E7A900" />
            <div className="text-xs whitespace-pre-line text-ink/80 mb-1">
              <b>{reality.nameZh}（{reality.nameEn}）</b>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="border border-stone-200 rounded p-2">
                <p className="font-medium text-reality">现实触发器 · {reality.triggerName}</p>
                <p className="text-ink/70 text-[10px]">{reality.triggerEffect.slice(0, 150)}……</p>
              </div>
              <div className="border border-stone-200 rounded p-2">
                <p className="font-medium text-reality">过载释放 · {reality.overloadReleaseName}</p>
                <p className="text-ink/70 text-[10px]">{reality.overloadReleaseEffect}</p>
              </div>
            </div>

            {realitySpecialAnswer && (
              <p className="text-xs mt-2">
                <b className="text-reality">{reality.personalQuestion}</b> {realitySpecialAnswer}
              </p>
            )}

            {/* Onboarding */}
            <div className="mt-2 border-t border-stone-200 pt-2">
              <p className="text-xs font-medium text-reality mb-1">入职问卷</p>
              {reality.onboardingQuestions.map((q, i) => (
                <div key={i} className="text-xs mb-1">
                  <span className="text-muted">{i + 1}. {q}</span>
                  <p className="font-medium pl-4">{onboardingAnswers[i] || '—'}</p>
                </div>
              ))}
            </div>

            {/* Relationships */}
            <div className="mt-2 border-t border-stone-200 pt-2">
              <p className="text-xs font-medium text-reality mb-1">人际关系</p>
              {relationships.length > 0 ? (
                <div className="space-y-1">
                  {relationships.map((r, i) => (
                    <div key={i} className="text-xs border border-stone-100 rounded p-1.5">
                      <p><b>{r.prompt}</b></p>
                      <p>
                        {r.name || '?'}{r.player ? ` (${r.player})` : ''}
                        {r.description ? ` — ${r.description}` : ''}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted">（未填写）</p>
              )}
            </div>
          </div>
        )}

        {/* Career Section */}
        {career && (
          <div>
            <SectionTitle label="职能" color="#D21F3C" />
            <div className="text-xs whitespace-pre-line text-ink/80 mb-1">
              <b>{career.nameZh}（{career.nameEn}）</b>
            </div>

            <div className="border border-stone-200 rounded p-2 mb-2 text-xs">
              <p className="font-medium text-career">
                最高原则："{career.primeDirective}"
              </p>
              <p className="text-[10px] text-muted">{career.primeDirectiveEffect}</p>
            </div>

            <div className="border border-stone-200 rounded p-2 mb-2 text-xs">
              <p className="font-medium text-career">授权行为</p>
              <ol className="list-decimal list-inside text-[10px]">
                {career.authorizedActions.map((a, i) => <li key={i}>{a}</li>)}
              </ol>
            </div>

            <div className="border border-stone-200 rounded p-2 text-xs">
              <p className="font-medium text-career">初始申领物 · {career.initialRequisition}</p>
              <p className="text-[10px] whitespace-pre-line text-ink/70">{career.requisitionEffect}</p>
            </div>

            {careerSpecialAnswer && (
              <p className="text-xs mt-2">
                <b className="text-career">{career.specialQuestion}</b> {careerSpecialAnswer}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
