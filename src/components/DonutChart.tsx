export type DonutSlice = {
  label: string;
  value: number;
};

type DonutChartProps = {
  data: DonutSlice[];
  size?: number;
  thickness?: number;
};

const palette = ["#1f1f1f", "#5a5a5a", "#8a8a8a", "#b4b4b4", "#d4d4d4", "#e6e6e6"];

const DonutChart = ({ data, size = 160, thickness = 22 }: DonutChartProps) => {
  const total = data.reduce((sum, s) => sum + s.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  if (total === 0) {
    return (
      <div className="donut">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label="No data">
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--bg-3)"
            strokeWidth={thickness}
          />
        </svg>
      </div>
    );
  }

  let offset = 0;

  return (
    <div className="donut">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label="Distribution"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--bg-2)"
          strokeWidth={thickness}
        />
        {data.map((slice, index) => {
          const fraction = slice.value / total;
          const dash = fraction * circumference;
          const dashOffset = -offset;
          offset += dash;
          return (
            <circle
              key={slice.label}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={palette[index % palette.length]}
              strokeWidth={thickness}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={dashOffset}
              transform={`rotate(-90 ${center} ${center})`}
            />
          );
        })}
      </svg>
      <ul className="donut-legend">
        {data.map((slice, index) => {
          const pct = total === 0 ? 0 : Math.round((slice.value / total) * 100);
          return (
            <li key={slice.label}>
              <span
                className="swatch"
                style={{ background: palette[index % palette.length] }}
                aria-hidden="true"
              />
              <span className="legend-label">{slice.label}</span>
              <span className="legend-value">
                {slice.value} <span className="muted">· {pct}%</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default DonutChart;
