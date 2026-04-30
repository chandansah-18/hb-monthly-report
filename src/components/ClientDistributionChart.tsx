import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { ClientSummary } from "../types";
import { formatInteger } from "../utils/formatters";

export function ClientDistributionChart({ clients }: { clients: ClientSummary[] }) {
  const total = clients.reduce((sum, client) => sum + client.cvs, 0);

  return (
    <div className="card">
      <div className="card-title">CV Volume by Client</div>
      <div className="chart-card chart-card-donut">
        <div className="donut-total">
          <span className="donut-total-value">{formatInteger(total)}</span>
          <span className="donut-total-label">Total CVs</span>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={clients}
              dataKey="cvs"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={94}
              paddingAngle={3}
            >
              {clients.map((client) => (
                <Cell key={client.id} fill={client.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => formatInteger(value)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
