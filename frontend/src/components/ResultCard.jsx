import React from 'react';
import { motion } from 'framer-motion';
import { CloudRain, Factory, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function ResultCard({ result }) {
  if (!result) return null;

  // Visual cues based on prediction
  const isHighCO2 = result.prediction.includes('CO2');
  const isCH4 = result.prediction.includes('CH4');
  
  const icon = isHighCO2 ? <Factory className="w-12 h-12 text-red-400" /> : 
               isCH4 ? <AlertTriangle className="w-12 h-12 text-yellow-400" /> : 
               <CloudRain className="w-12 h-12 text-blue-400" />;

  const gradient = isHighCO2 ? 'from-red-900/40 to-surface' : 'from-secondary/40 to-surface';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass-panel p-8 rounded-3xl bg-gradient-to-br ${gradient} border border-white/10 relative overflow-hidden`}
    >
      <div className="flex items-start justify-between relative z-10">
        <div>
          <h3 className="text-xl text-text/70 mb-2 font-medium">Predicted Emission Type</h3>
          <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            {result.prediction}
          </div>
        </div>
        <div className="p-4 bg-black/20 rounded-2xl">
          {icon}
        </div>
      </div>

      <div className="mt-8 space-y-4 relative z-10">
        <div className="flex justify-between text-sm">
          <span className="text-text/60">Confidence Score</span>
          <span className="font-semibold text-accent">{(result.confidence * 100).toFixed(1)}%</span>
        </div>
        <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${result.confidence * 100}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full bg-accent"
          ></motion.div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
        <h4 className="text-sm font-medium mb-4 text-text/80 text-center">Class Probabilities (KNN Distribution)</h4>
        <div className="grid grid-cols-3 gap-2">
           {Object.entries(result.all_probs).map(([cls, prob]) => (
             <div key={cls} className="text-center p-3 bg-black/20 rounded-xl">
                <div className="text-xs text-text/50 truncate mb-1" title={cls}>{cls}</div>
                <div className="font-semibold">{(prob * 100).toFixed(0)}%</div>
             </div>
           ))}
        </div>
      </div>
    </motion.div>
  );
}
