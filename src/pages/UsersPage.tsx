import { useState } from "react";
import BarList from "../components/BarList.tsx";
import DonutChart from "../components/DonutChart.tsx";
import StatCard from "../components/StatCard.tsx";
import UserDetail from "../components/UserDetail.tsx";
import UsersTable from "../components/UsersTable.tsx";
import {
  useAgeDistribution,
  useGenderRatio,
} from "../hooks/useUsersAnalytics.ts";
import type { UserRow } from "../api/users.ts";

const UsersPage = () => {
  const gender = useGenderRatio();
  const age = useAgeDistribution();
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);

  if (selectedUser) {
    return <UserDetail user={selectedUser} onBack={() => setSelectedUser(null)} />;
  }

  const total = gender.data?.total ?? age.data?.total;

  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Users</h1>
        <p className="page-subtitle">Registered accounts on Kitaab.</p>
      </header>

      <div className="stack">
        {total !== undefined && (
          <section className="stats-grid">
            <StatCard label="Total users" value={total} />
          </section>
        )}

        <section className="analytics-row">
          <div className="card">
            <h2 className="card-title">Gender ratio</h2>
            {gender.loading && !gender.data && <div className="muted">Loading…</div>}
            {gender.error && !gender.loading && (
              <div className="error">
                <div>Failed to load gender ratio: {gender.error.message}</div>
                <button type="button" className="link" onClick={gender.refetch}>
                  Retry
                </button>
              </div>
            )}
            {gender.data && (
              <DonutChart
                thickness={44}
                data={gender.data.distribution.map((d) => ({
                  label: d.gender,
                  value: d.count,
                }))}
              />
            )}
          </div>

          <div className="card">
            <h2 className="card-title">Age distribution</h2>
            {age.loading && !age.data && <div className="muted">Loading…</div>}
            {age.error && !age.loading && (
              <div className="error">
                <div>Failed to load age distribution: {age.error.message}</div>
                <button type="button" className="link" onClick={age.refetch}>
                  Retry
                </button>
              </div>
            )}
            {age.data && (
              <BarList
                data={age.data.distribution.map((d) => ({
                  label: `${d.age}`,
                  value: d.count,
                }))}
              />
            )}
          </div>
        </section>

        <section className="card">
          <h2 className="card-title">All users</h2>
          <div className="card-body">
            <UsersTable onSelect={setSelectedUser} />
          </div>
        </section>
      </div>
    </>
  );
};

export default UsersPage;
