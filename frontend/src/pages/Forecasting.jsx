import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getMetadata, getForecast } from '../api';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { TrendingUp, Info } from 'lucide-react';

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
        // Merge history and forecast for the chart
        const lastHistoryPoint = res.history[res.history.length - 1];
        const combined = [
          ...res.history.map(point => ({ ...point, type: 'Historical' })),
          { ...lastHistoryPoint, type: 'Forecast' }, // Start forecast from last history point for bridge
          ...res.forecast.map(point => ({ ...point, type: 'Forecast' }))
        ];
        setData(combined);
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
      <div className="flex flex-col lg:flex-row gap-12">
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
              <p className="text-[10px] text-text/40 italic">Default is 10 years. Max recommended: 50.</p>
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
              Our forecasting engine uses Linear Regression to compute the mathematical trajectory of greenhouse gas data. It analyzes historical variance to project where emission values will likely sit in the coming years.
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
                <div className="flex gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-secondary"></div>
                    <span className="text-text/70">Historical</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-accent border-2 border-accent border-dashed bg-transparent"></div>
                    <span className="text-text/70">Projection</span>
                  </div>
                </div>
              </div>

              <div className="flex-grow">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis 
                      dataKey="year" 
                      stroke="#E8F5E9" 
                      opacity={0.5} 
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#E8F5E9" 
                      opacity={0.5} 
                      fontSize={12}
                      label={{ value: 'Emissions (kt)', angle: -90, position: 'insideLeft', style: { fill: 'rgba(255,255,255,0.3)', fontSize: '10px' } }}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0A1612', border: '1px solid #2D6A4F', borderRadius: '12px' }}
                      itemStyle={{ fontSize: '12px' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#2D6A4F" 
                      strokeWidth={3} 
                      dot={false}
                      strokeDasharray={(d) => d?.type === 'Forecast' ? '5 5' : '0'} // Note: Recharts doesn't native support segmented dash per data point easily like this
                      connectNulls
                    />
                    {/* Secondary line for forecast for better visual separation */}
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#F4A261" 
                      strokeWidth={3} 
                      strokeDasharray="5 5"
                      dot={{ r: 4, fill: '#F4A261' }}
                      data={data.filter(d => d.type === 'Forecast' || d.year === data.find(p => p.type === 'Historical' && p.year === Math.max(...data.filter(x => x.type === 'Historical').map(x => x.year)))?.year)}
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
                <p className="text-text/50 max-w-sm">Select a specific area and item to see the mathematical trend lines for future agricultural emissions.</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
