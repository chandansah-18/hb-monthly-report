import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface HorizontalBarDatum {
  id: string;
  label: string;
  value: number;
  color: string;
}

export function HorizontalBarChartCard({
  title,
  data,
  framed = true,
}: {
  title: string;
  data: HorizontalBarDatum[];
  framed?: boolean;
}) {
  const content = (
    <>
      <div className="card-title">{title}</div>
      <div className="chart-card">
        <ResponsiveContainer width="100%" height={Math.max(260, data.length * 34)}>
          <BarChart data={data} layout="vertical" margin={{ top: 8, right: 12, left: 16, bottom: 8 }}>
            <XAxis type="number" hide />
            <YAxis
              dataKey="label"
              type="category"
              width={104}
              tick={{ fill: "#3d4152", fontSize: 12 }}
            />
            <Tooltip />
            <Bar dataKey="value" radius={[0, 8, 8, 0]}>
              {data.map((item) => (
                <Cell key={item.id} fill={item.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );

  if (!framed) {
    return content;
  }

  return <div className="card">{content}</div>;
}
