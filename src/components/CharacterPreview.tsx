import type { Anomaly, Reality, Career, RelationshipEntry, QualityName } from '../types/arc';
import { QUALITIES } from '../types/arc';

const navy = '#21143f';
const red = '#cf1f45';
const yellow = '#f3b429';
const blue = '#1569ad';

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

/* ── Reusable atoms ── */

function TriLogo({ letter, color, label }: { letter: string; color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
      <div style={{ position: 'relative', width: 64, height: 52 }}>
        <div style={{ clipPath: 'polygon(50% 0, 100% 100%, 0 100%)', background: color, width: '100%', height: '100%' }} />
        <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 12, fontSize: 30, fontWeight: 900, color: '#fff' }}>{letter}</span>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 20, fontWeight: 900, color }}>{label}</div>
        <div style={{ height: 3, marginTop: 4, background: color }} />
      </div>
    </div>
  );
}

function FieldLine({ label, value }: { label: string; value?: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontWeight: 900, fontSize: 18, color: navy, marginBottom: 8 }}>{label}</div>
      <div style={{ borderBottom: `2px solid ${navy}`, minHeight: 22, fontSize: 16, color: navy }}>
        {value || ''}
      </div>
    </div>
  );
}

function FilledTriangles({ count, total = 7 }: { count: number; total?: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 22, height: 18,
            clipPath: 'polygon(50% 0, 100% 100%, 0 100%)',
            background: i < count ? red : '#fff',
            border: `2px solid ${i < count ? red : '#cbd5e1'}`,
          }}
        />
      ))}
    </div>
  );
}

function ScoreRow({ label, score }: { label: string; score: number }) {
  const filled = Math.min(score, 7);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
      <div style={{ width: 48, height: 40, clipPath: 'polygon(50% 0, 100% 100%, 0 100%)', background: '#ffe4e6' }} />
      <div style={{ width: 44, fontWeight: 900, fontSize: 18, color: navy }}>{label}</div>
      <FilledTriangles count={filled} />
      <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 4 }}>{score}</span>
    </div>
  );
}

function BulletBlock({ color, title, text, children }: { color: string; title: string; text: string; children?: React.ReactNode }) {
  return (
    <div style={{ position: 'relative', paddingLeft: 24, paddingTop: 4, paddingBottom: 8, marginBottom: 4 }}>
      <div style={{ position: 'absolute', left: 0, top: 10, width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: `13px solid ${color}` }} />
      <div style={{ fontWeight: 900, fontSize: 18, color }}>{title}</div>
      <div style={{ fontWeight: 700, fontSize: 12, color: navy }}>{text}</div>
      {children}
    </div>
  );
}

function StarBadge({ color: c }: { color: string }) {
  return (
    <div style={{ width: 28, height: 28, borderRadius: '50%', border: `3px solid ${c}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: c, fontSize: 13 }}>★</div>
  );
}

function Page({ children }: { children: React.ReactNode }) {
  return (
    <section style={{ width: 768, minHeight: 1024, background: '#fff', padding: 36, margin: '0 auto 24px', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', fontSize: 12 }}>
      {children}
    </section>
  );
}

/* ── Page 1: Overview + Qualities ── */

function Page1({ form, anomaly, reality, career }: {
  form: Props;
  anomaly: Anomaly | null;
  reality: Reality | null;
  career: Career | null;
}) {
  return (
    <Page>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
        {/* Left column */}
        <div>
          <FieldLine label="角色姓名" value={form.characterName} />
          <FieldLine label="机构头衔" />
          <FieldLine label="机构评级" />

          <div style={{ marginTop: 28, marginBottom: 16 }}>
            {['嘉奖', '申诫', '额外过载'].map((x) => (
              <div key={x} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <StarBadge color={red} />
                <div style={{ width: 36, borderBottom: `2px solid ${red}` }} />
                <div style={{ fontSize: 22, fontWeight: 900, color: navy }}>{x}</div>
              </div>
            ))}
          </div>

          {reality && (
            <>
              <BulletBlock color={yellow} title="现实触发器" text={reality.triggerName + ' — ' + reality.triggerEffect.slice(0, 80) + '……'} />
              <BulletBlock color={yellow} title="过载解除" text={reality.overloadReleaseName + ' — ' + reality.overloadReleaseEffect} />
            </>
          )}

          {career && (
            <>
              <BulletBlock color={red} title="首要指令" text={`"${career.primeDirective}" — ${career.primeDirectiveEffect}`} />
              <BulletBlock color={red} title="许可行为" text="当你完成以下任一事项时，获得1点嘉奖：">
                <div style={{ marginTop: 8, fontSize: 15, color: red, lineHeight: 2 }}>
                  {career.authorizedActions.map((a, i) => <div key={i}>▷ {a}</div>)}
                </div>
                <div style={{ marginTop: 8, fontSize: 11, fontWeight: 700, color: navy }}>
                  如果你在单次任务中完成全部 3 项，将获得 3 点额外嘉奖。
                </div>
              </BulletBlock>
            </>
          )}
        </div>

        {/* Right column */}
        <div>
          <FieldLine label="人称代词" value={form.pronouns} />

          <div style={{ marginTop: 4, marginBottom: 16 }}>
            <TriLogo letter="A" color={blue} label={anomaly ? `异常体 · ${anomaly.nameZh}` : '异常体'} />
            <TriLogo letter="R" color={yellow} label={reality ? `现实 · ${reality.nameZh}` : '现实'} />
            <TriLogo letter="C" color={red} label={career ? `职能 · ${career.nameZh}` : '职能'} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 32 }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: navy, lineHeight: 1.2 }}>资质<br />保证</div>
            <div style={{ fontSize: 52, fontWeight: 900, color: red, transform: 'rotate(-20deg)' }}>Q</div>
          </div>

          <div style={{ marginTop: 12 }}>
            {QUALITIES.map((q) => (
              <ScoreRow key={q} label={q} score={form.qualityScores[q] || 0} />
            ))}
          </div>

          <div style={{ marginTop: 12, textAlign: 'right', fontSize: 13, fontWeight: 900, color: navy }}>
            总计：{QUALITIES.reduce((s, q) => s + (form.qualityScores[q] || 0), 0)} 点
          </div>
        </div>
      </div>
    </Page>
  );
}

/* ── Page 2: Anomaly Abilities ── */

function AbilityCard({ ability, choice }: {
  ability: Anomaly['abilities'][0];
  index?: number;
  choice?: 'a' | 'b';
}) {
  return (
    <div style={{ border: '1px solid #bdd2e6', borderRadius: 10, overflow: 'hidden', marginBottom: 14 }}>
      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: '45% 40% 15%', background: '#eaf2fb', fontSize: 12, fontWeight: 900, color: blue }}>
        <div style={{ padding: '8px 10px', borderRight: '1px solid #bdd2e6' }}>{ability.name}</div>
        <div style={{ padding: '8px 10px', borderRight: '1px solid #bdd2e6' }}>{ability.trigger.slice(0, 40)}……</div>
        <div style={{ padding: '8px 10px' }}>{ability.quality}</div>
      </div>

      {/* Body */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: 12 }}>
        {/* Success */}
        <div>
          <div style={{ fontWeight: 900, marginBottom: 6, color: blue, fontSize: 13 }}>▲ 成功时，</div>
          <div style={{ fontSize: 10, color: navy, lineHeight: 1.6 }}>{ability.success}</div>
          <div style={{ marginTop: 8, fontSize: 10, color: navy }}>
            <b style={{ color: blue }}>增强：</b>{ability.enhancement}
          </div>
        </div>

        {/* Failure */}
        <div>
          <div style={{ fontWeight: 900, marginBottom: 6, color: red, fontSize: 13 }}>✖ 失败时，</div>
          <div style={{ fontSize: 10, color: navy, lineHeight: 1.6 }}>{ability.failure}</div>

          {/* Q&A */}
          <div style={{ background: '#f8fafc', padding: 8, marginTop: 10, borderRadius: 6, fontSize: 11, color: blue }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>
              问：{ability.question}
            </div>
            {ability.answers.map((a) => (
              <div key={a.label} style={{ marginBottom: 2 }}>
                <b>{a.label.toUpperCase()}.</b> {a.text}
                <span style={{ marginLeft: 6, color: navy, fontSize: 10 }}>[{a.code}]</span>
                {choice === a.label && <span style={{ marginLeft: 6, color: red, fontWeight: 900, fontSize: 10 }}>◀ 已选</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Page2({ anomaly, abilityAnswers }: { anomaly: Anomaly | null; abilityAnswers: Record<string, 'a' | 'b'> }) {
  return (
    <Page>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
        <h1 style={{ fontSize: 30, fontWeight: 900, color: navy, margin: 0 }}>异常能力</h1>
        <div style={{ width: 220 }}>
          <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700, marginBottom: 4 }}>角色姓名 __________________</div>
          <TriLogo letter="A" color={blue} label={anomaly ? anomaly.nameZh : '异常'} />
        </div>
      </div>

      {anomaly ? (
        anomaly.abilities.map((ab, i) => (
          <AbilityCard key={i} ability={ab} index={i} choice={abilityAnswers[ab.name]} />
        ))
      ) : (
        <p style={{ color: '#94a3b8', fontSize: 13 }}>（未选择异常体）</p>
      )}
    </Page>
  );
}

/* ── Page 3: Relationships ── */

function RelationCard({ entry }: { entry: RelationshipEntry; index?: number }) {
  return (
    <div style={{ border: `2px solid ${yellow}`, borderRadius: 10, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#fffbeb', fontWeight: 900, fontSize: 11 }}>
        <div style={{ padding: '8px 10px', borderRight: `1px solid ${yellow}`, color: '#b98a13' }}>
          姓名 · {entry.name || '—'}
        </div>
        <div style={{ padding: '8px 10px', color: '#b98a13' }}>
          扮演者 · {entry.player || '—'}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: 10 }}>
        <div style={{ fontWeight: 900, marginBottom: 4, color: navy, fontSize: 11 }}>描述</div>
        <div style={{ borderBottom: `1px solid ${yellow}`, marginBottom: 8 }} />
        <div style={{ fontSize: 10, color: navy, minHeight: 32, lineHeight: 1.5 }}>
          {entry.description || entry.prompt}
        </div>

        {/* Track */}
        <div style={{ marginTop: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: 10, color: navy, marginBottom: 4 }}>
            {Array.from({ length: 10 }).map((_, i) => <span key={i} style={{ width: 16, textAlign: 'center' }}>{i}</span>)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <span style={{ fontSize: 16 }}>▶</span>
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${yellow}`, background: '#fff' }} />
            ))}
            <span style={{ color: yellow, fontWeight: 900 }}>◎</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Page3({ reality, relationships }: { reality: Reality | null; relationships: RelationshipEntry[] }) {
  return (
    <Page>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
        <h1 style={{ fontSize: 30, fontWeight: 900, color: navy, margin: 0 }}>关系</h1>
        <div style={{ width: 220 }}>
          <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700, marginBottom: 4 }}>角色姓名 __________________</div>
          <TriLogo letter="R" color={yellow} label={reality ? reality.nameZh : '现实'} />
        </div>
      </div>

      <div style={{ border: '1px solid #e5e0d0', borderRadius: 8, padding: 10, marginBottom: 18, fontWeight: 900, fontSize: 18, color: navy, width: 260 }}>
        ◎ 关系网内的关系
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {relationships.length > 0 ? (
          relationships.map((r, i) => <RelationCard key={i} entry={r} index={i} />)
        ) : (
          Array.from({ length: 6 }).map((_, i) => <RelationCard key={i} entry={{ prompt: '', name: '', player: '', description: '' }} index={i} />)
        )}
      </div>
    </Page>
  );
}

/* ── Page 4: Questionnaire + Career Credentials ── */

function Page4({ form, reality, career }: { form: Props; reality: Reality | null; career: Career | null }) {
  const questions: string[] = [];
  if (reality) questions.push(...reality.onboardingQuestions);
  // add career special question if any
  if (career?.specialQuestion) questions.push(career.specialQuestion);
  // pad to at least 7
  while (questions.length < 7) questions.push('');

  return (
    <Page>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 24 }}>
        {/* Left: Welcome + questionnaire */}
        <div>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: navy, margin: 0 }}>欢迎你，特工!</h1>
          <p style={{ fontWeight: 700, marginTop: 6, marginBottom: 14, color: navy, fontSize: 12 }}>
            请尽可能如实回答以下问题，以便机构和你的同事能更多地了解你。
          </p>

          {questions.map((q, i) => {
            // Determine answer: first 3 from onboarding, rest from special
            const answer = i < 3 ? form.onboardingAnswers[i] : (i === 3 && career?.specialQuestion ? form.careerSpecialAnswer : '');
            const hasAnswer = !!(answer && answer.trim());
            return (
              <div key={i} style={{ marginBottom: hasAnswer ? 14 : 24 }}>
                <div style={{ fontWeight: 900, color: navy, fontSize: 13 }}>
                  <span style={{ display: 'inline-flex', width: 20, height: 20, borderRadius: '50%', background: red, color: '#fff', alignItems: 'center', justifyContent: 'center', marginRight: 6, fontSize: 11 }}>{i + 1}</span>
                  {q || '（补充说明）'}
                </div>
                {hasAnswer ? (
                  <div style={{ marginLeft: 28, marginTop: 4, fontSize: 11, color: navy, background: '#f8fafc', padding: '4px 8px', borderRadius: 4, lineHeight: 1.5 }}>
                    {answer}
                  </div>
                ) : (
                  <div style={{ borderBottom: '1px solid #d9d7df', marginTop: 12, marginLeft: 28 }} />
                )}
              </div>
            );
          })}

          {/* Career requisition */}
          {career && (
            <div style={{ marginTop: 20, padding: 12, border: '1px solid #f0d0d6', borderRadius: 8, background: '#fff5f5' }}>
              <div style={{ fontWeight: 900, color: red, fontSize: 13 }}>初始申领物 · {career.initialRequisition}</div>
              <div style={{ fontSize: 10, color: navy, marginTop: 4, lineHeight: 1.5 }}>{career.requisitionEffect}</div>
            </div>
          )}
        </div>

        {/* Right: ID card + emergency */}
        <div>
          <div style={{ border: '1px solid #ddd', borderRadius: 12, padding: 12, minHeight: 200, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', position: 'relative' }}>
            <div style={{ height: 100, border: '1px solid #e5e5e5', borderRadius: 6, background: '#f8fafc', marginBottom: 12 }} />
            <div style={{ fontWeight: 900, color: red, fontSize: 13 }}>姓名</div>
            <div style={{ borderBottom: `1px solid ${red}`, marginBottom: 8, marginTop: 4, fontSize: 16, fontWeight: 900, color: navy }}>
              {form.characterName || '—'}
            </div>
            <div style={{ fontWeight: 900, fontSize: 11, color: red }}>
              人称代词 <span style={{ float: 'right', fontSize: 13 }}>TRIANGLE<br />AGENCY</span>
            </div>
            <div style={{ borderBottom: `1px solid ${red}`, marginTop: 12 }} />
            <div style={{ marginTop: 4, fontSize: 12, fontWeight: 900, color: navy }}>
              {form.pronouns || '—'}
            </div>
          </div>

          {/* Emergency contact */}
          <div style={{ border: `2px solid #efc6cf`, borderRadius: 10, padding: 12, marginTop: 16, color: red }}>
            <div style={{ fontWeight: 900, fontSize: 13 }}>紧急联系人</div>
            <div style={{ borderBottom: `1px solid ${red}`, marginTop: 12, marginBottom: 12 }} />
            <div style={{ fontWeight: 900, fontSize: 13 }}>关系</div>
            <div style={{ borderBottom: `1px solid ${red}`, marginTop: 12 }} />
            <div style={{ marginTop: 6, fontSize: 10, color: navy }}>
              {form.relationships[0]?.name || '—'}
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}

/* ── Main export ── */

export default function CharacterPreview(props: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0' }}>
      <Page1 form={props} anomaly={props.anomaly} reality={props.reality} career={props.career} />
      <Page2 anomaly={props.anomaly} abilityAnswers={props.abilityAnswers} />
      <Page3 reality={props.reality} relationships={props.relationships} />
      <Page4 form={props} reality={props.reality} career={props.career} />
    </div>
  );
}
