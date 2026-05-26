import type { VisitorMessage } from "../api/visitors.ts";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : dateFormatter.format(d);
};

type Props = {
  data: VisitorMessage[] | undefined;
  loading: boolean;
  error: Error | undefined;
  onRetry: () => void;
};

const VisitorMessages = ({ data, loading, error, onRetry }: Props) => {
  return (
    <section className="card">
      <h2 className="card-title">
        Messages
        {data && data.length > 0 && (
          <span className="card-title-count">{data.length}</span>
        )}
      </h2>

      {loading && !data && <div className="muted">Loading…</div>}

      {error && !loading && (
        <div className="error">
          <div>Failed to load messages: {error.message}</div>
          <button type="button" className="link" onClick={onRetry}>
            Retry
          </button>
        </div>
      )}

      {data && data.length === 0 && (
        <div className="muted">No messages from this visitor.</div>
      )}

      {data && data.length > 0 && (
        <ul className="messages-list">
          {data.map((m) => (
            <li key={m.id} className="message-item">
              <div className="message-head">
                <div className="message-from">
                  <span className="message-name">{m.name}</span>
                  <a className="message-email" href={`mailto:${m.email}`}>
                    {m.email}
                  </a>
                </div>
                <time className="message-date" dateTime={m.created_at}>
                  {formatDate(m.created_at)}
                </time>
              </div>
              <div className="message-subject">{m.subject}</div>
              <p className="message-body">{m.message}</p>
              {m.phone && (
                <div className="message-meta">
                  <span className="message-meta-label">Phone</span>
                  <a href={`tel:${m.phone}`}>{m.phone}</a>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default VisitorMessages;
