const STEPS = ['基础信息', '异常体', '现实身份', '人际关系', '职能', '自我评估', '预览导出'];

export default function StepNav({ step, onStep }: { step: number; onStep: (s: number) => void }) {
  return (
    <nav className="no-print flex items-center justify-center gap-1 py-4 px-2 flex-wrap">
      {STEPS.map((label, i) => {
        const active = i === step;
        const past = i < step;
        return (
          <button
            key={i}
            onClick={() => onStep(i)}
            className={
              'px-3 py-1.5 rounded-full text-xs font-medium transition border ' +
              (active
                ? 'bg-ink text-white border-ink'
                : past
                  ? 'bg-stone-200 text-ink/70 border-stone-200 hover:bg-stone-300'
                  : 'bg-white text-muted border-stone-300 hover:border-stone-400')
            }
          >
            {i + 1}. {label}
          </button>
        );
      })}
    </nav>
  );
}
