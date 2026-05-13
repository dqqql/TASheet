import { useState, useEffect, useCallback, useRef } from 'react';
import type { Anomaly, Reality, Career, CharacterFormState, RelationshipEntry, QualityName } from './types/arc';
import { emptyForm, GENERIC_ONBOARDING } from './types/arc';
import { loadForm, saveForm, clearForm, exportJson, importJson } from './utils/storage';
import anomaliesRaw from './data/anomalies.json';
import realitiesRaw from './data/realities.json';
import careersRaw from './data/careers.json';

const anomaliesData = anomaliesRaw as Record<string, Anomaly>;
const realitiesData = realitiesRaw as Record<string, Reality>;
const careersData = careersRaw as Record<string, Career>;

import StepNav from './components/StepNav';
import BasicInfo from './components/BasicInfo';
import AnomalySection from './components/AnomalySection';
import RealitySection from './components/RealitySection';
import RelationshipEditor from './components/RelationshipEditor';
import CareerSection from './components/CareerSection';
import SelfAssessment from './components/SelfAssessment';
import CharacterPreview from './components/CharacterPreview';

const anomalyList = Object.values(anomaliesData);
const realityList = Object.values(realitiesData);
const careerList = Object.values(careersData);

const anomalyOptions = anomalyList.map((a) => ({ id: a.id, nameZh: a.nameZh, nameEn: a.nameEn }));
const realityOptions = realityList.map((r) => ({ id: r.id, nameZh: r.nameZh, nameEn: r.nameEn }));
const careerOptions = careerList.map((c) => ({ id: c.id, nameZh: c.nameZh, nameEn: c.nameEn }));

export default function App() {
  const [form, setForm] = useState<CharacterFormState>(() => loadForm());
  const [step, setStep] = useState(0);
  const initRef = useRef(false);

  // Auto-save
  useEffect(() => {
    if (!initRef.current) { initRef.current = true; return; }
    saveForm(form);
  }, [form]);

  // Ensure relationships array matches reality prompts
  useEffect(() => {
    const reality = realityList.find((r) => r.id === form.realityId);
    if (!reality) return;
    const n = reality.relationshipPrompts.length;
    if (form.relationships.length !== n) {
      const entries: RelationshipEntry[] = reality.relationshipPrompts.map((p, i) => {
        const existing = form.relationships[i];
        return existing && existing.prompt === p.question
          ? existing
          : { prompt: p.question, name: '', player: '', description: '' };
      });
      setForm((prev) => ({ ...prev, relationships: entries }));
    }
  }, [form.realityId]);

  const update = useCallback(<K extends keyof CharacterFormState>(key: K, value: CharacterFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const anomaly = anomalyList.find((a) => a.id === form.anomalyId) || null;
  const reality = realityList.find((r) => r.id === form.realityId) || null;
  const career = careerList.find((c) => c.id === form.careerId) || null;

  const handlePrint = () => window.print();
  const handleClear = () => { if (confirm('确定要清空当前角色数据吗？')) { clearForm(); setForm(emptyForm()); setStep(0); } };
  const handleImport = async () => {
    try {
      const data = await importJson();
      setForm(data);
      setStep(0);
    } catch { /* user cancelled */ }
  };

  const isLastStep = step === 6;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="no-print border-b-2 border-ink bg-white">
        <div className="mx-auto flex max-w-5xl items-stretch px-4">
          <div className="flex w-20 items-center justify-center border-x-2 border-ink bg-ink text-white">
            <span className="text-3xl font-black leading-none">△</span>
          </div>
          <div className="flex-1 px-4 py-4 sm:px-6">
            <p className="agency-kicker">STABILIZE REALITY / CONTROL YOURSELF</p>
            <h1 className="mt-1 text-2xl font-black text-ink sm:text-3xl">
              三角机构 · 特工入职清单
            </h1>
            <p className="mt-1 text-xs font-bold uppercase text-career">
              Triangle Agency · Agent Onboarding Form TA-ARC-07
            </p>
          </div>
        </div>
      </header>

      <StepNav step={step} onStep={setStep} />

      {/* Main content */}
      <main className="flex-1 px-4 pb-14 pt-4 max-w-5xl mx-auto w-full space-y-8">
        {step === 0 && (
          <BasicInfo
            characterName={form.characterName}
            pronouns={form.pronouns}
            agencyTitle={form.agencyTitle}
            agencyRank={form.agencyRank}
            commendations={form.commendations}
            reprimands={form.reprimands}
            extraOverload={form.extraOverload}
            onChange={(field, value) => update(field as keyof CharacterFormState, value)}
          />
        )}

        {step === 1 && (
          <AnomalySection
            options={anomalyOptions}
            value={form.anomalyId}
            onChange={(id) => update('anomalyId', id)}
            data={anomaly}
            answers={form.abilityAnswers}
            onAnswer={(name, choice) =>
              update('abilityAnswers', { ...form.abilityAnswers, [name]: choice })
            }
          />
        )}

        {step === 2 && (<>
          <RealitySection
            options={realityOptions}
            value={form.realityId}
            onChange={(id) => update('realityId', id)}
            data={reality}
            specialAnswer={form.realitySpecialAnswer}
            onSpecialAnswer={(v) => update('realitySpecialAnswer', v)}
            onboardingAnswers={form.onboardingAnswers}
            onOnboardingAnswer={(i, v) => {
              const next = [...form.onboardingAnswers];
              next[i] = v;
              update('onboardingAnswers', next);
            }}
          />

          <div className="agency-shell mx-auto max-w-3xl space-y-4 p-4 sm:p-5">
            <div className="border-b border-ink/20 pb-3">
              <p className="agency-kicker">General Intake</p>
              <h3 className="agency-title">入职问卷</h3>
              <p className="mt-1 text-xs text-muted">以下为通用入职问题，与所选现实无关。</p>
            </div>
            {GENERIC_ONBOARDING.map((q, i) => (
              <div key={i} className="agency-section-soft">
                <p className="text-sm font-bold text-ink">{String(i + 1).padStart(2, '0')} / {q}</p>
                <textarea
                  className="agency-textarea text-xs"
                  rows={2}
                  value={form.genericOnboardingAnswers[i] || ''}
                  onChange={(e) => {
                    const next = [...form.genericOnboardingAnswers];
                    next[i] = e.target.value;
                    update('genericOnboardingAnswers', next);
                  }}
                />
              </div>
            ))}
          </div>
        </>)}

        {step === 3 && (
          <RelationshipEditor
            prompts={reality?.relationshipPrompts || []}
            entries={form.relationships}
            onChange={(entries) => update('relationships', entries)}
          />
        )}

        {step === 4 && (
          <CareerSection
            options={careerOptions}
            value={form.careerId}
            onChange={(id) => update('careerId', id)}
            data={career}
            specialAnswer={form.careerSpecialAnswer}
            onSpecialAnswer={(v) => update('careerSpecialAnswer', v)}
            requisitions={form.customRequisitions}
            onRequisitionsChange={(r) => update('customRequisitions', r)}
          />
        )}

        {step === 5 && (
          <SelfAssessment
            career={career}
            choices={form.assessmentChoices}
            onChoice={(i, choice) =>
              update('assessmentChoices', { ...form.assessmentChoices, [i]: choice })
            }
            scores={form.qualityScores}
            onScoreChange={(q: QualityName, v: number) =>
              update('qualityScores', { ...form.qualityScores, [q]: v })
            }
            onResetScores={(newScores) => update('qualityScores', newScores)}
          />
        )}

        {step === 6 && (
          <div className="space-y-4">
            <div className="no-print flex justify-center gap-3 flex-wrap">
              <button
                onClick={handlePrint}
                className="agency-button bg-ink text-white hover:bg-ink/90"
              >
                打印 / 导出 PDF
              </button>
              <button
                onClick={() => exportJson(form)}
                className="agency-button bg-white text-ink hover:bg-stone-100"
              >
                导出存档 JSON
              </button>
              <button
                onClick={handleImport}
                className="agency-button bg-white text-ink hover:bg-stone-100"
              >
                导入存档 JSON
              </button>
              <button
                onClick={handleClear}
                className="agency-button border-career bg-white text-career hover:bg-career-soft"
              >
                清空角色
              </button>
            </div>
            <CharacterPreview
              characterName={form.characterName}
              pronouns={form.pronouns}
              agencyTitle={form.agencyTitle}
              agencyRank={form.agencyRank}
              commendations={form.commendations}
              reprimands={form.reprimands}
              extraOverload={form.extraOverload}
              anomaly={anomaly}
              reality={reality}
              career={career}
              abilityAnswers={form.abilityAnswers}
              realitySpecialAnswer={form.realitySpecialAnswer}
              careerSpecialAnswer={form.careerSpecialAnswer}
              onboardingAnswers={form.onboardingAnswers}
              genericOnboardingAnswers={form.genericOnboardingAnswers}
              relationships={form.relationships}
              qualityScores={form.qualityScores}
              requisitions={form.customRequisitions}
            />
          </div>
        )}
      </main>

      {/* Step nav footer */}
      <footer className="no-print sticky bottom-0 flex justify-center gap-2 border-t-2 border-ink bg-white px-4 py-3">
        <button
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className="agency-button bg-white text-ink hover:bg-stone-100"
        >
          ← 上一步
        </button>
        <span className="border-y border-ink/20 px-4 py-2 text-sm font-black tabular-nums text-muted self-center">
          {step + 1} / 7
        </span>
        {!isLastStep ? (
          <button
            onClick={() => setStep((s) => Math.min(6, s + 1))}
            className="agency-button bg-ink text-white hover:bg-ink/90"
          >
            下一步 →
          </button>
        ) : null}
      </footer>
    </div>
  );
}
