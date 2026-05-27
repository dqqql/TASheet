import { FormEvent, useEffect, useState } from 'react';

interface FeedbackMessage {
  id: string;
  content: string;
  nickname: string;
  createdAt: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

const MAX_CONTENT_LENGTH = 800;
const MAX_NICKNAME_LENGTH = 24;

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function FeedbackDialog({ open, onClose }: Props) {
  const [messages, setMessages] = useState<FeedbackMessage[]>([]);
  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadMessages = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/feedback');
      const contentType = response.headers.get('Content-Type') || '';
      if (!response.ok || !contentType.includes('application/json')) {
        throw new Error('反馈服务暂未连接，请部署 Cloudflare Pages Functions 后再试。');
      }
      const data = await response.json() as { messages: FeedbackMessage[] };
      setMessages(data.messages);
    } catch (err) {
      setError(err instanceof Error ? err.message : '反馈列表暂时无法读取。');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    void loadMessages();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedContent = content.trim();
    const trimmedNickname = nickname.trim();
    if (!trimmedContent) {
      setError('请输入反馈内容。');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: trimmedContent, nickname: trimmedNickname }),
      });
      const contentType = response.headers.get('Content-Type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('反馈服务暂未连接，请部署 Cloudflare Pages Functions 后再试。');
      }
      const data = await response.json().catch(() => ({})) as { message?: FeedbackMessage; error?: string };
      if (!response.ok || !data.message) throw new Error(data.error || '提交失败，请稍后再试。');
      setMessages((current) => [data.message!, ...current]);
      setContent('');
      setNickname('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '提交失败，请稍后再试。');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="no-print fixed inset-0 z-50 bg-ink/55 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="mx-auto flex max-h-[88vh] max-w-4xl flex-col border-2 border-ink bg-stone-50 shadow-[12px_12px_0_rgba(26,26,46,0.28)]">
        <div className="flex items-stretch border-b-2 border-ink bg-white">
          <div className="flex aspect-square w-16 shrink-0 items-center justify-center bg-anomaly sm:w-20">
            <span className="h-0 w-0 border-x-[18px] border-b-[31px] border-x-transparent border-b-career sm:border-x-[22px] sm:border-b-[38px]" />
          </div>
          <div className="flex-1 px-4 py-3">
            <p className="agency-kicker">Anonymous Forum / Incident Notes</p>
            <h2 className="agency-title">建议 / 反馈</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex aspect-square w-16 shrink-0 items-center justify-center border-l-2 border-ink text-2xl font-black leading-none text-ink transition hover:bg-career hover:text-white sm:w-20"
            aria-label="关闭建议反馈"
          >
            X
          </button>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[340px_1fr]">
          <form onSubmit={handleSubmit} className="space-y-3 border-b-2 border-ink bg-white p-4 lg:border-b-0 lg:border-r-2">
            <div>
              <label className="agency-label" htmlFor="feedback-nickname">署名（可选）</label>
              <input
                id="feedback-nickname"
                className="agency-input"
                maxLength={MAX_NICKNAME_LENGTH}
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
                placeholder="匿名特工"
              />
            </div>
            <div>
              <label className="agency-label" htmlFor="feedback-content">留言</label>
              <textarea
                id="feedback-content"
                className="agency-textarea min-h-36"
                maxLength={MAX_CONTENT_LENGTH}
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="规则勘误、使用体验、想要的新功能，都可以写在这里。"
              />
              <p className="mt-1 text-right text-[10px] font-bold text-muted">{content.length} / {MAX_CONTENT_LENGTH}</p>
            </div>
            {error ? <p className="border border-career bg-career-soft px-3 py-2 text-xs font-bold text-career">{error}</p> : null}
            <button
              type="submit"
              disabled={submitting}
              className="agency-button w-full bg-anomaly text-white hover:bg-anomaly/90"
            >
              {submitting ? '提交中...' : '提交匿名反馈'}
            </button>
            <p className="text-xs leading-relaxed text-muted">
              留言会公开展示。请不要提交私人联系方式、真实身份信息或跑团剧透。
            </p>
          </form>

          <section className="min-h-0 overflow-y-auto p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="agency-kicker">Message Board</p>
                <h3 className="text-lg font-black text-ink">历史留言</h3>
              </div>
              <button
                type="button"
                onClick={() => void loadMessages()}
                className="agency-button bg-white text-ink hover:bg-stone-100"
              >
                刷新
              </button>
            </div>

            {loading ? <p className="agency-section-soft text-sm font-bold text-muted">正在读取留言...</p> : null}
            {!loading && messages.length === 0 ? (
              <p className="agency-section-soft text-sm font-bold text-muted">暂时还没有留言。你可以成为第一位留下便签的特工。</p>
            ) : null}
            <div className="space-y-3">
              {messages.map((message) => (
                <article key={message.id} className="agency-section bg-white">
                  <div className="flex items-start justify-between gap-3 border-b border-ink/15 pb-2">
                    <div>
                      <p className="text-sm font-black text-ink">{message.nickname || '匿名特工'}</p>
                      <p className="agency-kicker">{formatDate(message.createdAt)}</p>
                    </div>
                    <span className="mt-1 h-0 w-0 border-x-[8px] border-b-[14px] border-x-transparent border-b-anomaly" />
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-ink">{message.content}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
