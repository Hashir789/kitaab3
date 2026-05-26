type StatCardProps = {
  label: string;
  value: number | string;
};

const formatter = new Intl.NumberFormat();

const StatCard = ({ label, value }: StatCardProps) => {
  const display = typeof value === "number" ? formatter.format(value) : value;
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{display}</div>
    </div>
  );
};

export default StatCard;
