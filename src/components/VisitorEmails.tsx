import type { VisitorEmail } from "../api/visitors.ts";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : dateFormatter.format(d);
};

type Props = {
  data: VisitorEmail[] | undefined;
  loading: boolean;
  error: Error | undefined;
  onRetry: () => void;
};

const VisitorEmails = ({ data, loading, error, onRetry }: Props) => {
  return (
    <section className="card">
      <h2 className="card-title">
        Emails
        {data && data.length > 0 && (
          <span className="card-title-count">{data.length}</span>
        )}
      </h2>

      {loading && !data && <div className="muted">Loading…</div>}

      {error && !loading && (
        <div className="error">
          <div>Failed to load emails: {error.message}</div>
          <button type="button" className="link" onClick={onRetry}>
            Retry
          </button>
        </div>
      )}

      {data && data.length === 0 && (
        <div className="muted">No emails from this visitor.</div>
      )}

      {data && data.length > 0 && (
        <ul className="emails-list">
          {data.map((e) => (
            <li key={e.id} className="email-item">
              <a className="email-address" href={`mailto:${e.email}`}>
                {e.email}
              </a>
              <time className="email-date" dateTime={e.created_at}>
                {formatDate(e.created_at)}
              </time>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default VisitorEmails;
