import type { UserVisitor } from "../api/users.ts";
import { formatDateTime } from "../lib/dates.ts";

type Props = {
  data: UserVisitor[] | undefined;
  loading: boolean;
  error: Error | undefined;
  onRetry: () => void;
};

const UserVisitors = ({ data, loading, error, onRetry }: Props) => {
  return (
    <section className="card">
      <h2 className="card-title">
        Visitors
        {data && data.length > 0 && (
          <span className="card-title-count">{data.length}</span>
        )}
      </h2>

      {loading && !data && <div className="muted">Loading…</div>}

      {error && !loading && (
        <div className="error">
          <div>Failed to load visitors: {error.message}</div>
          <button type="button" className="link" onClick={onRetry}>
            Retry
          </button>
        </div>
      )}

      {data && data.length === 0 && (
        <div className="muted">No visitors associated with this user.</div>
      )}

      {data && data.length > 0 && (
        <ul className="users-list">
          {data.map((v) => (
            <li key={v.id} className="user-item">
              <div className="user-head">
                <div className="user-id">
                  <span className="user-id-label">Anonymous ID</span>
                  <code className="mono">{v.anonymous_id}</code>
                </div>
                <div className="user-badges">
                  <span className="badge badge-muted capitalize">{v.device_type}</span>
                </div>
              </div>

              <dl className="user-grid">
                <div className="user-field">
                  <dt>Timezone</dt>
                  <dd>{v.timezone}</dd>
                </div>
                <div className="user-field">
                  <dt>Visits</dt>
                  <dd>{v.number_of_visits}</dd>
                </div>
                <div className="user-field">
                  <dt>Navigations</dt>
                  <dd>{v.navigations}</dd>
                </div>
                <div className="user-field">
                  <dt>Clicks</dt>
                  <dd>{v.clicks}</dd>
                </div>
                <div className="user-field">
                  <dt>Last visited</dt>
                  <dd>{formatDateTime(v.last_visited)}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default UserVisitors;
