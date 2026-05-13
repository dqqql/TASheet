const STEPS = ['基础信息', '异常', '现实', '人际关系', '职能', '资质', '预览导出'];

export default function StepNav({ step, onStep }: { step: number; onStep: (s: number) => void }) {
  return (
    <nav className="no-print border-b border-ink/20 bg-stone-50/95 px-3 py-3">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-1 sm:grid-cols-4 lg:grid-cols-7">
        {STEPS.map((label, i) => {
          const active = i === step;
          const past = i < step;
          return (
            <button
              key={i}
              onClick={() => onStep(i)}
              className={
                'border px-3 py-2 text-left text-[11px] font-black uppercase transition ' +
                (active
                  ? 'border-ink bg-ink text-white'
                  : past
                    ? 'border-ink/30 bg-white text-ink hover:border-ink'
                    : 'border-stone-300 bg-white/70 text-muted hover:border-ink/60 hover:text-ink')
              }
            >
              <span className={active ? 'text-white/60' : past ? 'text-career' : 'text-muted/70'}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="ml-2">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
