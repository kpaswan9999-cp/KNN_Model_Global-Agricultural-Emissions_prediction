import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Calendar, MapPin, Gauge, Eye } from 'lucide-react';
import { getHistory, deleteFromHistory, clearHistory } from '../utils/history';

export default function History() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleDelete = (id) => {
    const updated = deleteFromHistory(id);
    setHistory(updated);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      clearHistory();
      setHistory([]);
    }
  };

  const handleViewAgain = (item) => {
    navigate('/predict', { state: { inputs: item.inputs, result: item.result } });
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Prediction History</h1>
          <p className="text-text/60">Review and manage your previous agricultural emission analysis.</p>
        </div>
        
        {history.length > 0 && (
          <div className="flex gap-4">
            <button 
              onClick={handleClear}
              className="px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/20 transition-all flex items-center gap-2 text-sm font-medium"
            >
              <Trash2 className="w-4 h-4" /> Clear All
            </button>
          </div>
        )}
      </div>

      <AnimatePresence mode="popLayout">
        {history.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 glass-panel rounded-3xl border border-dashed border-white/10"
          >
            <Calendar className="w-16 h-16 text-text/10 mx-auto mb-6" />
            <h2 className="text-xl font-medium text-text/40">No history found yet.</h2>
            <p className="text-text/20 mt-2">Your predictions will appear here once you perform them.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {history.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row items-center gap-6 group hover:border-accent/30 transition-all"
              >
                {/* Result Indicator */}
                <div className={`w-2 h-16 rounded-full group-hover:scale-y-110 transition-transform ${
                  item.result.prediction.includes('CO2') ? 'bg-red-400' : 
                  item.result.prediction.includes('CH4') ? 'bg-yellow-400' : 'bg-blue-400'
                }`} />

                {/* Main Content */}
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-accent drop-shadow-sm">
                      {new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    {item.result.prediction} 
                    <span className="ml-3 text-sm font-normal text-text/40 italic">
                      ({(item.result.confidence * 100).toFixed(0)}% Confidence)
                    </span>
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-text/60">
                      <MapPin className="w-4 h-4 text-secondary" /> {item.inputs.Area}
                    </div>
                    <div className="flex items-center gap-2 text-text/60">
                      <Calendar className="w-4 h-4 text-accent" /> {item.inputs.Year}
                    </div>
                    <div className="flex items-center gap-2 text-text/60">
                      <Gauge className="w-4 h-4 text-primary" /> {Number(item.inputs.Value).toLocaleString()} kt
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                    onClick={() => handleViewAgain(item)}
                    className="p-3 text-accent/60 hover:text-accent hover:bg-accent/10 rounded-xl transition-all"
                    title="View details again"
                   >
                     <Eye className="w-5 h-5" />
                   </button>
                   <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-3 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                    title="Delete record"
                   >
                     <Trash2 className="w-5 h-5" />
                   </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
