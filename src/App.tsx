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
      <header className="no-print bg-ink text-white py-4 px-6 text-center">
        <h1 className="text-lg font-black tracking-widest">三角机构 · 特工入职清单</h1>
        <p className="text-xs text-white/50 mt-0.5">TRIANGLE AGENCY · AGENT ONBOARDING</p>
      </header>

      <StepNav step={step} onStep={setStep} />

      {/* Main content */}
      <main className="flex-1 px-4 pb-12 max-w-3xl mx-auto w-full space-y-8">
        {step === 0 && (
          <BasicInfo
            characterName={form.characterName}
            pronouns={form.pronouns}
            onChange={(field, value) => update(field, value)}
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

          <div className="max-w-2xl mx-auto space-y-4">
            <h3 className="text-sm font-medium text-ink mt-6 mb-2">入职问卷</h3>
            <p className="text-xs text-muted -mt-2 mb-4">以下为通用入职问题，与所选现实无关。</p>
            {GENERIC_ONBOARDING.map((q, i) => (
              <div key={i} className="bg-white rounded-lg border border-stone-200 p-4">
                <p className="text-sm font-medium text-ink mb-2">{i + 1}. {q}</p>
                <textarea
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs focus:border-ink focus:outline-none"
                  rows={2}
                  value={form.genericOnboardingAnswers[i] || ''}
                  onChange={(e) => {
                    const next = [...form.genericOnboardingAnswers];
                    next[i] = e.target.value;
                    update('genericOnboardingAnswers', next);
                  }}
                  placeholder="在此填写……"
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
                className="px-6 py-2 bg-ink text-white rounded-full text-sm font-bold hover:bg-ink/90 transition"
              >
                打印 / 导出 PDF
              </button>
              <button
                onClick={() => exportJson(form)}
                className="px-6 py-2 bg-white border border-stone-300 rounded-full text-sm font-medium hover:bg-stone-100 transition"
              >
                导出存档 JSON
              </button>
              <button
                onClick={handleImport}
                className="px-6 py-2 bg-white border border-stone-300 rounded-full text-sm font-medium hover:bg-stone-100 transition"
              >
                导入存档 JSON
              </button>
              <button
                onClick={handleClear}
                className="px-6 py-2 bg-white border border-red-300 text-red-500 rounded-full text-sm font-medium hover:bg-red-50 transition"
              >
                清空角色
              </button>
            </div>
            <CharacterPreview
              characterName={form.characterName}
              pronouns={form.pronouns}
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
            />
          </div>
        )}
      </main>

      {/* Step nav footer */}
      <footer className="no-print flex justify-center gap-2 py-4 border-t border-stone-200 bg-white sticky bottom-0">
        <button
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className="px-4 py-2 rounded-full text-sm border border-stone-300 disabled:opacity-30 hover:bg-stone-100 transition"
        >
          ← 上一步
        </button>
        <span className="px-4 py-2 text-sm text-muted self-center">
          {step + 1} / 7
        </span>
        {!isLastStep ? (
          <button
            onClick={() => setStep((s) => Math.min(6, s + 1))}
            className="px-6 py-2 rounded-full text-sm bg-ink text-white font-medium hover:bg-ink/90 transition"
          >
            下一步 →
          </button>
        ) : null}
      </footer>
    </div>
  );
}
