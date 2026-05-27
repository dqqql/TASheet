import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { updates } from '../utils/updates';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function UpdateAnnouncementDialog({ open, onClose }: Props) {
  const [selectedId, setSelectedId] = useState(updates[0]?.id ?? '');
  const selected = updates.find((item) => item.id === selectedId) ?? updates[0];

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="no-print fixed inset-0 z-50 bg-ink/55 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="mx-auto flex max-h-[88vh] max-w-5xl flex-col border-2 border-ink bg-stone-50 shadow-[12px_12px_0_rgba(26,26,46,0.28)]">
        <div className="flex items-stretch border-b-2 border-ink bg-white">
          <div className="flex aspect-square w-16 shrink-0 items-center justify-center bg-reality sm:w-20">
            <span className="h-0 w-0 border-x-[18px] border-b-[31px] border-x-transparent border-b-career sm:border-x-[22px] sm:border-b-[38px]" />
          </div>
          <div className="flex-1 px-4 py-3">
            <p className="agency-kicker">Update Archive / Reality Stabilization Memo</p>
            <h2 className="agency-title">更新公告</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex aspect-square w-16 shrink-0 items-center justify-center border-l-2 border-ink text-2xl font-black leading-none text-ink transition hover:bg-career hover:text-white sm:w-20"
            aria-label="关闭更新公告"
          >
            X
          </button>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[280px_1fr]">
          <aside className="max-h-56 overflow-y-auto border-b-2 border-ink bg-white lg:max-h-none lg:border-b-0 lg:border-r-2">
            {updates.length === 0 ? (
              <p className="p-4 text-sm font-bold text-muted">暂无更新记录。</p>
            ) : (
              updates.map((item) => {
                const active = item.id === selected?.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={
                      'block w-full border-b border-ink/15 px-4 py-3 text-left transition ' +
                      (active ? 'bg-reality-soft text-ink' : 'bg-white text-muted hover:bg-stone-100 hover:text-ink')
                    }
                  >
                    <span className="block text-[10px] font-black uppercase text-reality">{item.date}</span>
                    <span className="mt-1 block text-sm font-black">{item.title}</span>
                    {item.summary ? <span className="mt-1 block text-xs leading-relaxed">{item.summary}</span> : null}
                  </button>
                );
              })
            )}
          </aside>

          <section className="min-h-0 overflow-y-auto p-4 sm:p-6">
            {selected ? (
              <article className="agency-section bg-white">
                <p className="agency-kicker">{selected.date}</p>
                <h3 className="mt-1 text-2xl font-black text-ink">{selected.title}</h3>
                {selected.summary ? <p className="mt-2 text-sm font-bold text-muted">{selected.summary}</p> : null}
                <div className="mt-5 space-y-3 text-sm leading-7 text-ink">
                  <ReactMarkdown
                    components={{
                      h2: ({ children }) => <h4 className="border-b border-ink/20 pb-1 pt-2 text-lg font-black">{children}</h4>,
                      ul: ({ children }) => <ul className="space-y-2">{children}</ul>,
                      li: ({ children }) => (
                        <li className="relative pl-5 before:absolute before:left-0 before:top-2 before:h-0 before:w-0 before:border-y-[5px] before:border-l-[8px] before:border-y-transparent before:border-l-reality">
                          {children}
                        </li>
                      ),
                      a: ({ children, href }) => (
                        <a className="font-black text-anomaly underline decoration-2 underline-offset-2" href={href} target="_blank" rel="noreferrer">
                          {children}
                        </a>
                      ),
                      code: ({ children }) => <code className="bg-stone-100 px-1 py-0.5 text-xs font-bold">{children}</code>,
                    }}
                  >
                    {selected.body}
                  </ReactMarkdown>
                </div>
              </article>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
}
