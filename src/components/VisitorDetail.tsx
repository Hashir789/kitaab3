import type { VisitorRow } from "../api/visitors.ts";
import { useVisitorEmails } from "../hooks/useVisitorEmails.ts";
import { useVisitorMessages } from "../hooks/useVisitorMessages.ts";
import { useVisitorUsers } from "../hooks/useVisitorUsers.ts";
import StatCard from "./StatCard.tsx";
import VisitorEmails from "./VisitorEmails.tsx";
import VisitorMessages from "./VisitorMessages.tsx";
import VisitorUsers from "./VisitorUsers.tsx";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : dateFormatter.format(d);
};

type Props = {
  visitor: VisitorRow;
  onBack: () => void;
};

const VisitorDetail = ({ visitor, onBack }: Props) => {
  const messages = useVisitorMessages(visitor.anonymous_id);
  const emails = useVisitorEmails(visitor.anonymous_id);
  const users = useVisitorUsers(visitor.anonymous_id);

  return (
    <div className="stack">
      <button type="button" className="back-link" onClick={onBack}>
        <span aria-hidden="true">←</span> Back to visitors
      </button>

      <header className="page-header">
        <h1 className="page-title detail-title">
          <code className="mono mono-lg">{visitor.anonymous_id}</code>
        </h1>
        <p className="page-subtitle">Visitor details</p>
      </header>

      <section className="stats-grid">
        <StatCard label="Visits" value={visitor.number_of_visits} />
        <StatCard label="Navigations" value={visitor.navigations} />
        <StatCard label="Clicks" value={visitor.clicks} />
      </section>

      <section className="card">
        <h2 className="card-title">Profile</h2>
        <dl className="detail-grid">
          <div className="detail-row">
            <dt>Anonymous ID</dt>
            <dd>
              <code className="mono">{visitor.anonymous_id}</code>
            </dd>
          </div>
          <div className="detail-row">
            <dt>Internal ID</dt>
            <dd>
              <code className="mono">{visitor.id}</code>
            </dd>
          </div>
          <div className="detail-row">
            <dt>Device</dt>
            <dd className="capitalize">{visitor.device_type}</dd>
          </div>
          <div className="detail-row">
            <dt>Timezone</dt>
            <dd>{visitor.timezone}</dd>
          </div>
          <div className="detail-row">
            <dt>Last visited</dt>
            <dd>{formatDate(visitor.last_visited)}</dd>
          </div>
          <div className="detail-row">
            <dt>First seen</dt>
            <dd>{formatDate(visitor.created_at)}</dd>
          </div>
        </dl>
      </section>

      <VisitorUsers
        data={users.data?.details}
        loading={users.loading}
        error={users.error}
        onRetry={users.refetch}
      />

      <VisitorMessages
        data={messages.data?.details}
        loading={messages.loading}
        error={messages.error}
        onRetry={messages.refetch}
      />

      <VisitorEmails
        data={emails.data?.details}
        loading={emails.loading}
        error={emails.error}
        onRetry={emails.refetch}
      />
    </div>
  );
};

export default VisitorDetail;
