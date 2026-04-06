import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import PredictionForm from '../components/PredictionForm';
import ResultCard from '../components/ResultCard';

export default function Prediction() {
  const location = useLocation();
  const [result, setResult] = useState(location.state?.result || null);

  // If we came from history with a result, clear the state so it doesn't persist on refresh
  useEffect(() => {
    if (location.state?.result) {
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto">
        
        {/* Form Column */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1"
        >
          <div className="mb-8">
             <h1 className="text-3xl font-bold mb-2">Emission Prediction</h1>
             <p className="text-text/60">Enter the agricultural parameters to predict the dominant emission element using our trained K-Nearest Neighbors model.</p>
          </div>
          <div className="glass-panel p-8 rounded-3xl border border-secondary/20">
            <PredictionForm 
              onResult={setResult} 
              initialData={location.state?.inputs} 
            />
          </div>
        </motion.div>

        {/* Results Column */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1"
        >
          {result ? (
            <div className="space-y-6 lg:mt-[104px]">
               <ResultCard result={result} />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-12 text-center lg:mt-0 mt-8 rounded-3xl glass-panel border border-dashed border-white/10 text-white/30">
               Awaiting parameters to perform KNN classification...
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
