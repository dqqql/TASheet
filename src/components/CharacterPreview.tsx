import type { Anomaly, Reality, Career, RelationshipEntry, QualityName, RequisitionEntry } from '../types/arc';
import { QUALITIES, GENERIC_ONBOARDING } from '../types/arc';

const navy = '#21143f';
const red = '#cf1f45';
const yellow = '#f3b429';
const blue = '#1569ad';

interface Props {
  characterName: string;
  pronouns: string;
  agencyTitle: string;
  agencyRank: string;
  commendations: string;
  reprimands: string;
  extraOverload: string;
  anomaly: Anomaly | null;
  reality: Reality | null;
  career: Career | null;
  abilityAnswers: Record<string, 'a' | 'b'>;
  realitySpecialAnswer: string;
  careerSpecialAnswer: string;
  onboardingAnswers: string[];
  genericOnboardingAnswers: string[];
  relationships: RelationshipEntry[];
  qualityScores: Record<QualityName, number>;
  requisitions: RequisitionEntry[];
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

function Page({ children }: { children: React.ReactNode }) {
  return (
    <section className="print-page" style={{ margin: '0 auto 24px', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', fontSize: 12 }}>
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
          <FieldLine label="机构头衔" value={form.agencyTitle} />
          <FieldLine label="机构评级" value={form.agencyRank} />

          <div style={{ marginTop: 24, marginBottom: 16 }}>
            {[
              { label: '嘉奖', value: form.commendations },
              { label: '申诫', value: form.reprimands },
              { label: '额外过载', value: form.extraOverload },
            ].map((x) => (
              <div key={x.label} style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
                <div style={{ fontWeight: 900, fontSize: 16, color: navy, minWidth: 64 }}>{x.label}</div>
                <div style={{ flex: 1, borderBottom: `2px solid #94a3b8`, minHeight: 22, fontSize: 20, color: navy, textAlign: 'center', fontWeight: 900 }}>
                  {x.value || ''}
                </div>
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
            <TriLogo letter="A" color={blue} label={anomaly ? `异常 · ${anomaly.nameZh}` : '异常'} />
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
    <div style={{ border: '1px solid #bdd2e6', overflow: 'hidden', marginBottom: 14 }}>
      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: '45% 40% 15%', background: '#eaf2fb', fontSize: 14, fontWeight: 900, color: blue, textAlign: 'center' }}>
        <div style={{ padding: '10px 10px', borderRight: '1px solid #bdd2e6' }}>能力 · {ability.name}</div>
        <div style={{ padding: '10px 10px', borderRight: '1px solid #bdd2e6' }}>触发器</div>
        <div style={{ padding: '10px 10px' }}>资质 · {ability.quality}</div>
      </div>

      {/* Body */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: 14 }}>
        {/* Success */}
        <div>
          <div style={{ marginBottom: 10, padding: '8px 10px', background: '#f8fafc', borderLeft: `3px solid ${yellow}` }}>
            <div style={{ fontWeight: 900, marginBottom: 4, color: yellow, fontSize: 14 }}>触发</div>
            <div style={{ fontSize: 11, color: navy, lineHeight: 1.6 }}>{ability.trigger}</div>
          </div>
          <div style={{ fontWeight: 900, marginBottom: 6, color: blue, fontSize: 14 }}>▲ 成功时，</div>
          <div style={{ fontSize: 11, color: navy, lineHeight: 1.6 }}>{ability.success}</div>
          <div style={{ marginTop: 8, fontSize: 11, color: navy }}>
            <b style={{ color: blue }}>增强：</b>{ability.enhancement}
          </div>
        </div>

        {/* Failure */}
        <div>
          <div style={{ fontWeight: 900, marginBottom: 6, color: red, fontSize: 14 }}>✖ 失败时，</div>
          <div style={{ fontSize: 11, color: navy, lineHeight: 1.6 }}>{ability.failure}</div>

          {/* Q&A */}
          <div style={{ background: '#f8fafc', padding: 8, marginTop: 10, fontSize: 11, color: blue }}>
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
        <p style={{ color: '#94a3b8', fontSize: 13 }}>（未选择异常）</p>
      )}
    </Page>
  );
}

/* ── Page 3: Relationships ── */

function RelationCard({ entry }: { entry: RelationshipEntry; index?: number }) {
  const bondBonus = entry.bondBonus ?? '';

  return (
    <div style={{ border: `2px solid ${yellow}`, overflow: 'hidden' }}>
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
          {entry.description || ''}
        </div>

        {/* Track */}
        <div style={{ marginTop: 8 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', alignItems: 'center', fontWeight: 900, fontSize: 10, color: '#b98a13', marginBottom: 4 }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} style={{ textAlign: 'center' }}>{i}</span>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', alignItems: 'center' }}>
            <span style={{ color: yellow, fontSize: 16, lineHeight: 1, textAlign: 'center' }}>▶</span>
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} style={{ display: 'flex', justifyContent: 'center' }}>
                <span style={{ width: 14, height: 14, border: `2px solid ${yellow}`, background: '#fff' }} />
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 8 }}>
          <div style={{ color: '#b98a13', fontWeight: 900, fontSize: 11, marginBottom: 4 }}>连结加成</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 34px', gap: 8, alignItems: 'center', background: '#fffbeb', padding: 8 }}>
            <div style={{ minHeight: 34, color: navy, fontSize: 10, lineHeight: 1.5, whiteSpace: 'pre-line' }}>
              {bondBonus || (
                <>
                  <div style={{ borderBottom: `1px solid ${yellow}`, height: 13 }} />
                  <div style={{ borderBottom: `1px solid ${yellow}`, height: 13, marginTop: 5 }} />
                </>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 20, height: 20, border: `2px solid ${yellow}`, background: '#fff' }} />
            </div>
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

      <div style={{ border: '1px solid #e5e0d0', padding: 10, marginBottom: 18, fontWeight: 900, fontSize: 18, color: navy, width: 260 }}>
        ◎ 关系
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {relationships.length > 0 ? (
          relationships.map((r, i) => <RelationCard key={i} entry={r} index={i} />)
        ) : (
          Array.from({ length: 6 }).map((_, i) => <RelationCard key={i} entry={{ prompt: '', name: '', player: '', description: '', bondRewardId: '', bondBonus: '' }} index={i} />)
        )}
      </div>
    </Page>
  );
}

/* ── Page 4: Questionnaire + Career Credentials ── */

function QuestionItem({
  index,
  question,
  answer,
  color,
  answerBg,
}: {
  index: string;
  question: string;
  answer?: string;
  color: string;
  answerBg: string;
}) {
  const hasAnswer = !!(answer && answer.trim());
  return (
    <div style={{ marginBottom: hasAnswer ? 14 : 24 }}>
      <div style={{ fontWeight: 900, color: navy, fontSize: 13 }}>
        <span style={{ display: 'inline-flex', width: 24, height: 20, background: color, color: '#fff', alignItems: 'center', justifyContent: 'center', marginRight: 6, fontSize: 10 }}>{index}</span>
        {question}
      </div>
      {hasAnswer ? (
        <div style={{ marginLeft: 30, marginTop: 4, fontSize: 11, color: navy, background: answerBg, padding: '4px 8px', lineHeight: 1.5 }}>
          {answer}
        </div>
      ) : (
        <div style={{ borderBottom: '1px solid #d9d7df', marginTop: 12, marginLeft: 30 }} />
      )}
    </div>
  );
}

function Page4({ form, reality }: { form: Props; reality: Reality | null; career: Career | null }) {
  const questions = GENERIC_ONBOARDING;
  const answers = form.genericOnboardingAnswers || [];
  const realityQuestions = reality
    ? [
        ...(reality.personalQuestion ? [{ question: reality.personalQuestion, answer: form.realitySpecialAnswer }] : []),
        ...reality.onboardingQuestions.map((question, i) => ({ question, answer: form.onboardingAnswers[i] || '' })),
      ]
    : [];

  return (
    <Page>
      <h1 style={{ fontSize: 30, fontWeight: 900, color: navy, margin: '0 0 6px' }}>欢迎你，特工!</h1>
      <p style={{ fontWeight: 700, marginBottom: 20, color: navy, fontSize: 12 }}>
        请尽可能如实回答以下问题，以便机构和你的同事能更多地了解你。
      </p>

      {questions.map((q, i) => (
        <QuestionItem
          key={q}
          index={String(i + 1)}
          question={q}
          answer={answers[i]}
          color={red}
          answerBg="#f8fafc"
        />
      ))}

      {realityQuestions.length > 0 && (
        <div style={{ marginTop: 18, paddingTop: 14, borderTop: `3px solid ${yellow}` }}>
          <div style={{ color: yellow, fontSize: 18, fontWeight: 900, marginBottom: 10 }}>
            现实 · {reality?.nameZh}
          </div>
          {realityQuestions.map((item, i) => (
            <QuestionItem
              key={item.question}
              index={`R${i + 1}`}
              question={item.question}
              answer={item.answer}
              color={yellow}
              answerBg="#fffbeb"
            />
          ))}
        </div>
      )}
    </Page>
  );
}

/* ── Page 5: Requisitions ── */

function Page5({ career, requisitions }: { career: Career | null; requisitions: RequisitionEntry[] }) {
  const items = requisitions.length > 0 ? requisitions : (
    career ? [{ name: career.initialRequisition, effect: career.requisitionEffect, code: '' }] : []
  );

  return (
    <Page>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <h1 style={{ fontSize: 30, fontWeight: 900, color: navy, margin: 0, lineHeight: 1.2 }}>
          申领物<br />与福利
        </h1>
        <div style={{ width: 260 }}>
          <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700, marginBottom: 4 }}>角色姓名 __________________</div>
          <TriLogo letter="C" color={red} label={career ? `职能 · ${career.nameZh}` : '职能'} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map((r, i) => (
          <div key={i} style={{ border: `2px solid #efc6cf`, overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '31% 51% 18%', background: '#ffe4e8', fontWeight: 900, fontSize: 14, color: red, textAlign: 'center' }}>
              <div style={{ padding: '12px 12px', borderRight: '1px solid #efc6cf' }}>名称</div>
              <div style={{ padding: '12px 12px', borderRight: '1px solid #efc6cf' }}>效果</div>
              <div style={{ padding: '12px 12px' }}>页面 / PD代码</div>
            </div>
            {/* Body */}
            <div style={{ display: 'grid', gridTemplateColumns: '31% 51% 18%', minHeight: 100 }}>
              <div style={{ padding: 12, borderRight: '1px solid #efc6cf', fontSize: 14, fontWeight: 700, color: navy, textAlign: 'center' }}>
                {r.name}
              </div>
              <div style={{ padding: 12, borderRight: '1px solid #efc6cf', fontSize: 11, color: navy, lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {r.effect}
              </div>
              <div style={{ padding: 12, fontSize: 11, color: navy, textAlign: 'center' }}>
                {r.code}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
}

/* ── Main export ── */

export default function CharacterPreview(props: Props) {
  return (
    <div className="print-preview" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0' }}>
      <Page1 form={props} anomaly={props.anomaly} reality={props.reality} career={props.career} />
      <Page2 anomaly={props.anomaly} abilityAnswers={props.abilityAnswers} />
      <Page3 reality={props.reality} relationships={props.relationships} />
      <Page5 career={props.career} requisitions={props.requisitions} />
      <Page4 form={props} reality={props.reality} career={props.career} />
    </div>
  );
}
