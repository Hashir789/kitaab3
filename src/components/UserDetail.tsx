import type { UserRow } from "../api/users.ts";
import { calculateAge, formatDate, formatDateTime } from "../lib/dates.ts";

type Props = {
  user: UserRow;
  onBack: () => void;
};

const UserDetail = ({ user, onBack }: Props) => {
  return (
    <div className="stack">
      <button type="button" className="back-link" onClick={onBack}>
        <span aria-hidden="true">←</span> Back to users
      </button>

      <header className="page-header">
        <h1 className="page-title detail-title">
          <code className="mono mono-lg">#{user.id}</code>
        </h1>
        <p className="page-subtitle">User details</p>
      </header>

      <section className="card">
        <div className="card-toolbar">
          <h2 className="card-title">Profile</h2>
          <div className="user-badges">
            <span
              className={`badge${user.email_verified ? " badge-success" : " badge-muted"}`}
            >
              {user.email_verified ? "Email verified" : "Email unverified"}
            </span>
            <span
              className={`badge${user.two_factor_enabled ? " badge-success" : " badge-muted"}`}
            >
              {user.two_factor_enabled ? "2FA on" : "2FA off"}
            </span>
          </div>
        </div>

        <dl className="detail-grid">
          <div className="detail-row">
            <dt>User ID</dt>
            <dd>
              <code className="mono">#{user.id}</code>
            </dd>
          </div>
          <div className="detail-row">
            <dt>Visitor ID</dt>
            <dd>
              <code className="mono">#{user.visitor_id}</code>
            </dd>
          </div>
          <div className="detail-row">
            <dt>Gender</dt>
            <dd className="capitalize">{user.gender}</dd>
          </div>
          <div className="detail-row">
            <dt>Age</dt>
            <dd>{calculateAge(user.dob)}</dd>
          </div>
          <div className="detail-row">
            <dt>Date of birth</dt>
            <dd>{formatDate(user.dob)}</dd>
          </div>
          <div className="detail-row">
            <dt>Last login</dt>
            <dd>{formatDateTime(user.last_login_at)}</dd>
          </div>
          <div className="detail-row">
            <dt>Created</dt>
            <dd>{formatDateTime(user.created_at)}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
};

export default UserDetail;
