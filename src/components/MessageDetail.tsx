import type { MessageRow } from "../api/visitors.ts";
import { formatDateTime } from "../lib/dates.ts";

type Props = {
  message: MessageRow;
  onBack: () => void;
};

const MessageDetail = ({ message, onBack }: Props) => {
  return (
    <div className="stack">
      <button type="button" className="back-link" onClick={onBack}>
        <span aria-hidden="true">←</span> Back to messages
      </button>

      <header className="page-header">
        <h1 className="page-title">{message.subject}</h1>
        <p className="page-subtitle">Message details</p>
      </header>

      <section className="card">
        <h2 className="card-title">From</h2>
        <dl className="detail-grid">
          <div className="detail-row">
            <dt>Name</dt>
            <dd>{message.name}</dd>
          </div>
          <div className="detail-row">
            <dt>Email</dt>
            <dd>
              <a className="text-link" href={`mailto:${message.email}`}>
                {message.email}
              </a>
            </dd>
          </div>
          <div className="detail-row">
            <dt>Phone</dt>
            <dd>
              {message.phone ? (
                <a className="text-link" href={`tel:${message.phone}`}>
                  {message.phone}
                </a>
              ) : (
                <span className="muted">—</span>
              )}
            </dd>
          </div>
          <div className="detail-row">
            <dt>Received</dt>
            <dd>{formatDateTime(message.created_at)}</dd>
          </div>
        </dl>
      </section>

      <section className="card">
        <h2 className="card-title">Message</h2>
        <p className="message-body">{message.message}</p>
      </section>
    </div>
  );
};

export default MessageDetail;
