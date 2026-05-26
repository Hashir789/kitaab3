import { useState } from "react";
import BarList from "../components/BarList.tsx";
import DonutChart from "../components/DonutChart.tsx";
import EmailsTable from "../components/EmailsTable.tsx";
import MessageDetail from "../components/MessageDetail.tsx";
import MessagesTable from "../components/MessagesTable.tsx";
import SegmentedControl from "../components/SegmentedControl.tsx";
import StatCard from "../components/StatCard.tsx";
import VisitorDetail from "../components/VisitorDetail.tsx";
import VisitorsTable from "../components/VisitorsTable.tsx";
import { useVisitorsSummary } from "../hooks/useVisitorsSummary.ts";
import type { MessageRow, VisitorRow } from "../api/visitors.ts";

type ActivityTab = "visitors" | "messages" | "emails";

const activityTabs: ReadonlyArray<{ value: ActivityTab; label: string }> = [
  { value: "visitors", label: "Visitors" },
  { value: "messages", label: "Messages" },
  { value: "emails", label: "Emails" },
];

const VisitorsPage = () => {
  const { data, error, loading, refetch } = useVisitorsSummary();
  const [activeTab, setActiveTab] = useState<ActivityTab>("visitors");
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorRow | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<MessageRow | null>(null);

  if (selectedVisitor) {
    return (
      <VisitorDetail
        visitor={selectedVisitor}
        onBack={() => setSelectedVisitor(null)}
      />
    );
  }

  if (selectedMessage) {
    return (
      <MessageDetail
        message={selectedMessage}
        onBack={() => setSelectedMessage(null)}
      />
    );
  }

  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Visitors</h1>
        <p className="page-subtitle">Sessions and traffic across Kitaab.</p>
      </header>

      {loading && <div className="card muted">Loading…</div>}

      {error && !loading && (
        <div className="card error">
          <div>Failed to load analytics: {error.message}</div>
          <button type="button" className="link" onClick={refetch}>
            Retry
          </button>
        </div>
      )}

      {data && !loading && !error && (
        <div className="stack">
          <section className="stats-grid">
            <StatCard label="Visitors" value={data.summary.visitors} />
            <StatCard label="Visits" value={data.summary.visits} />
            <StatCard label="Navigations" value={data.summary.navigations} />
            <StatCard label="Clicks" value={data.summary.clicks} />
          </section>

          <section className="analytics-row">
            <div className="card">
              <h2 className="card-title">Device distribution</h2>
              <DonutChart
                thickness={44}
                data={data.device_distribution.map((d) => ({
                  label: d.device_type,
                  value: d.count,
                }))}
              />
            </div>

            <div className="card">
              <h2 className="card-title">Timezones</h2>
              <BarList
                data={data.timezones.map((t) => ({
                  label: t.timezone,
                  value: t.count,
                }))}
              />
            </div>
          </section>

          <section className="card">
            <div className="card-toolbar">
              <SegmentedControl
                ariaLabel="Activity"
                options={activityTabs}
                value={activeTab}
                onChange={setActiveTab}
              />
            </div>
            <div className="card-body">
              {activeTab === "visitors" && (
                <VisitorsTable onSelect={setSelectedVisitor} />
              )}
              {activeTab === "messages" && (
                <MessagesTable onSelect={setSelectedMessage} />
              )}
              {activeTab === "emails" && <EmailsTable />}
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default VisitorsPage;
