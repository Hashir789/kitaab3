export type BarItem = {
  label: string;
  value: number;
};

type BarListProps = {
  data: BarItem[];
  emptyMessage?: string;
};

const BarList = ({ data, emptyMessage = "No data" }: BarListProps) => {
  if (data.length === 0) {
    return <div className="muted">{emptyMessage}</div>;
  }

  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <ul className="bar-list">
      {data.map((item) => {
        const pct = (item.value / max) * 100;
        return (
          <li key={item.label} className="bar-row">
            <div className="bar-row-head">
              <span className="bar-label">{item.label}</span>
              <span className="bar-value">{item.value}</span>
            </div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${pct}%` }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default BarList;
