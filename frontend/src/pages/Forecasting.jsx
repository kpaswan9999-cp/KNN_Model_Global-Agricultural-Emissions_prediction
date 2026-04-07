import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMetadata, getForecast } from '../api';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { TrendingUp, Info, Table as TableIcon, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export default function Forecasting() {
  const [metadata, setMetadata] = useState(null);
  const [formData, setFormData] = useState({
    area: '',
    item: '',
    element: '',
    years: 10
  });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const resultsRef = useRef(null);

  useEffect(() => {
    getMetadata().then(setMetadata).catch(() => setError('Failed to load metadata.'));
  }, []);

  const handleRunForecast = async () => {
    if (!formData.area || !formData.item || !formData.element) {
      setError('Please select all parameters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await getForecast(formData);
      if (res.success) {
        // Create a unified data structure for Recharts
        // This prevents the "dots at the start" bug
        const lastHistPoint = res.history[res.history.length - 1];
        
        const chartData = [
          ...res.history.map(p => ({
            year: p.year,
            historical: p.value,
            forecast: null
          })),
          ...res.forecast.map((p, i) => ({
            year: p.year,
            historical: i === 0 ? lastHistPoint.value : null, // Bridge the gap
            forecast: p.value
          }))
        ];

        // Prepare table data including growth calculation
        const tableData = res.forecast.map((p, i) => {
          const prevValue = i === 0 ? lastHistPoint.value : res.forecast[i-1].value;
          const diff = p.value - prevValue;
          const percent = ((diff / prevValue) * 100).toFixed(2);
          return { ...p, diff, percent };
        });

        setData({ chart: chartData, table: tableData, history: res.history });
        
        // Scroll to results
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } else {
        setError(res.error);
      }
    } catch (err) {
      setError('Error communicating with the forecast API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-12 mb-16">
        {/* Controls Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-1/3 space-y-8"
        >
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <TrendingUp className="text-accent" />
              Trend Forecasting
            </h1>
            <p className="text-text/60 mt-2">Project future emission levels based on three decades of historical patterns.</p>
          </div>

          <div className="glass-panel p-6 rounded-3xl space-y-6">
            <div className="space-y-4">
              <label className="text-sm font-medium text-text/80">Select Region / Area</label>
              <select 
                className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-accent appearance-none"
                value={formData.area}
                onChange={(e) => setFormData({...formData, area: e.target.value})}
              >
                <option value="">Choose Area...</option>
                {metadata?.categories.Area.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium text-text/80">Agricultural Item</label>
              <select 
                className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-accent appearance-none"
                value={formData.item}
                onChange={(e) => setFormData({...formData, item: e.target.value})}
              >
                <option value="">Choose Item...</option>
                {metadata?.categories.Item.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium text-text/80">Emission Type</label>
              <select 
                className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-accent appearance-none"
                value={formData.element}
                onChange={(e) => setFormData({...formData, element: e.target.value})}
              >
                <option value="">Choose Element...</option>
                {metadata?.target_classes.map(el => <option key={el} value={el}>{el}</option>)}
              </select>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium text-text/80">Years to Predict</label>
              <div className="relative">
                <input 
                  type="number"
                  min="1"
                  max="50"
                  className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-accent transition-colors"
                  value={formData.years}
                  onChange={(e) => setFormData({...formData, years: parseInt(e.target.value) || 1})}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-text/30">Years</span>
              </div>
            </div>

            <button 
              onClick={handleRunForecast}
              disabled={loading}
              className="w-full py-4 rounded-xl bg-accent text-background font-bold hover:shadow-[0_0_20px_rgba(244,162,97,0.4)] transition-all flex items-center justify-center gap-2 group"
            >
              {loading ? 'Crunching Numbers...' : `Generate ${formData.years}-Year Forecast`}
            </button>

            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
                {error}
              </div>
            )}
          </div>

          <div className="p-6 rounded-3xl border border-white/5 bg-white/2 cursor-help">
            <div className="flex gap-3 text-accent text-sm font-semibold mb-2">
              <Info className="w-4 h-4" />
              How it works
            </div>
            <p className="text-xs text-text/50 leading-relaxed">
              Our regression model compute the mathematical trajectory of data points from 1990 to 2021. The "bridge" point allows the forecast to maintain continuity with the most recent record.
            </p>
          </div>
        </motion.div>

        {/* Chart View */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full lg:w-2/3 min-h-[500px] glass-panel rounded-3xl p-8 relative overflow-hidden"
        >
          {data ? (
            <div className="h-full flex flex-col">
              <div className="mb-6 flex justify-between items-end">
                <div>
                   <h2 className="text-xl font-bold">{formData.area}</h2>
                   <p className="text-text/50 text-sm">{formData.item} • {formData.element}</p>
                </div>
                <div className="flex gap-6 text-[10px] uppercase tracking-wider font-bold">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-secondary"></div>
                    <span className="text-text/50">Historical</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                    <span className="text-text/50">Projection</span>
                  </div>
                </div>
              </div>

              <div className="flex-grow">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.chart} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="year" stroke="#E8F5E9" opacity={0.3} fontSize={10} />
                    <YAxis stroke="#E8F5E9" opacity={0.3} fontSize={10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0A1612', border: '1px solid #2D6A4F', borderRadius: '12px' }}
                      itemStyle={{ fontSize: '12px' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="historical" 
                      stroke="#2D6A4F" 
                      strokeWidth={3} 
                      dot={false}
                      activeDot={{ r: 6, fill: '#2D6A4F' }}
                      connectNulls
                    />
                    <Line 
                      type="monotone" 
                      dataKey="forecast" 
                      stroke="#F4A261" 
                      strokeWidth={3} 
                      strokeDasharray="5 5"
                      dot={{ r: 4, fill: '#F4A261' }}
                      activeDot={{ r: 6, fill: '#F4A261' }}
                      connectNulls
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-6">
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
                 <TrendingUp className="w-10 h-10 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Ready to Visualize?</h3>
                <p className="text-text/50 max-w-sm">Select parameters to see the year-wise forecast for agricultural emissions levels.</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Results Table Section */}
      <div ref={resultsRef} className="pt-8">
        <AnimatePresence>
          {data && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-accent/10 text-accent">
                       <TableIcon size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Year-Wise Prediction Details</h2>
                 </div>
                 <div className="text-text/50 text-sm italic">
                    Based on Linear Regression analysis
                 </div>
              </div>

              <div className="glass-panel rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10 uppercase text-[10px] tracking-[0.2em] font-bold text-text/60">
                      <th className="px-8 py-6">Forecast Year</th>
                      <th className="px-8 py-6 text-right">Predicted Value (kt)</th>
                      <th className="px-8 py-6 text-center">Trend Status</th>
                      <th className="px-8 py-6 text-right">Relative Change (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.table.map((row, idx) => (
                      <motion.tr 
                        key={row.year}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="px-8 py-6 font-bold text-white group-hover:text-accent transition-colors">
                          {row.year}
                        </td>
                        <td className="px-8 py-6 text-right font-mono text-text/90">
                          {row.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center justify-center gap-2">
                             {row.diff > 0.01 ? (
                               <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-bold ring-1 ring-red-500/20">
                                 <ArrowUpRight size={14} /> Higher
                               </div>
                             ) : row.diff < -0.01 ? (
                               <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold ring-1 ring-green-500/20">
                                 <ArrowDownRight size={14} /> Lower
                               </div>
                             ) : (
                               <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-text/60 text-xs font-bold ring-1 ring-white/10">
                                 <Minus size={14} /> Stable
                               </div>
                             )}
                           </div>
                        </td>
                        <td className={`px-8 py-6 text-right font-bold ${row.percent > 0 ? 'text-red-400/80' : 'text-green-400/80'}`}>
                          {row.percent > 0 ? '+' : ''}{row.percent}%
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-8 rounded-[2rem] glass-panel border border-dashed border-white/10 text-center text-text/40 text-sm">
                Statistical predictions are calculated as kt (kilotonnes). The trend represents the year-over-year mathematical variance in the projection.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
