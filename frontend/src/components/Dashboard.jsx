import React, { useEffect, useState } from 'react';
import { getStats } from '../api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const COLORS = ['#F4A261', '#2D6A4F', '#1B4332', '#e9c46a', '#e76f51', '#264653', '#f4a261', '#2a9d8f'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats().then(data => {
      setStats(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-64 flex items-center justify-center text-accent animate-pulse">Loading Global Datasets...</div>;
  if (!stats) return <div className="p-4 bg-red-900/20 text-red-200 rounded-xl">Failed to load statistics</div>;

  const topAreas = stats.top_areas.labels.map((label, i) => ({ name: label, value: stats.top_areas.values[i] }));
  const trends = stats.yearly_trend.labels.map((label, i) => ({ year: label, emission: stats.yearly_trend.values[i] }));
  const elements = stats.element_dist.labels.map((label, i) => ({ name: label, value: stats.element_dist.values[i] }));

  return (
    <div className="space-y-8 mt-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top emitting areas */}
        <div className="glass-panel p-6 rounded-3xl">
          <h3 className="text-lg font-medium mb-6 text-text/80">Top Highest Emitting Countries</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topAreas} layout="vertical" margin={{ left: 50, right: 20 }}>
                <XAxis type="number" stroke="#E8F5E9" opacity={0.5} />
                <YAxis dataKey="name" type="category" width={100} stroke="#E8F5E9" opacity={0.8} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#0A1612', border: '1px solid #2D6A4F' }} />
                <Bar dataKey="value" fill="#2D6A4F" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Global Emission Proportion */}
        <div className="glass-panel p-6 rounded-3xl">
          <h3 className="text-lg font-medium mb-6 text-text/80">Global Emission Distribution</h3>
          <div className="h-80 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={elements} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value">
                  {elements.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0A1612', border: '1px solid #2D6A4F' }} />
              </PieChart>
            </ResponsiveContainer>
            {/* Overlay Info */}
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-accent">CO2</span>
                <span className="text-xs text-text/50">Dominant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Global Emission trend */}
      <div className="glass-panel p-6 rounded-3xl">
          <h3 className="text-lg font-medium mb-6 text-text/80">Total Global Agricultural Emissions (1990 - Present)</h3>
          <div className="h-80">
             <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trends}>
                   <XAxis dataKey="year" stroke="#E8F5E9" opacity={0.5} />
                   <YAxis stroke="#E8F5E9" opacity={0.5} />
                   <Tooltip contentStyle={{ backgroundColor: '#0A1612', border: '1px solid #2D6A4F' }} />
                   <Line type="monotone" dataKey="emission" stroke="#F4A261" strokeWidth={3} dot={false} activeDot={{ r: 8, fill: '#F4A261' }} />
                </LineChart>
             </ResponsiveContainer>
          </div>
      </div>
    </div>
  );
}
