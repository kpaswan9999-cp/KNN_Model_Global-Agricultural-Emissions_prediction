import React, { useState, useEffect } from 'react';
import { getMetadata, predictEmissions } from '../api';
import { saveToHistory } from '../utils/history';
import { motion } from 'framer-motion';

export default function PredictionForm({ onResult, initialData: propInitialData }) {
  const [metadata, setMetadata] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getMetadata().then(data => {
      setMetadata(data);
      let initialData = {};
      data.columns.forEach(col => {
        if (col !== 'Element' && col !== 'Element Code') {
          if (data.categories[col] && data.categories[col].length > 0) {
            initialData[col] = data.categories[col][0];
          } else {
            initialData[col] = ''; 
          }
        }
      });
      if (propInitialData) {
        setFormData(propInitialData);
      } else {
        setFormData(initialData);
      }
      setLoading(false);
    }).catch(err => {
      setError('Failed to load model metadata.');
      setLoading(false);
    });
  }, []);

  const handleChange = (col, val) => {
    setFormData(prev => ({ ...prev, [col]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPredicting(true);
    setError('');
    try {
      const result = await predictEmissions(formData);
      if(result.success) {
        onResult(result);
        saveToHistory(result, formData);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('There was an error communicating with the backend API.');
    } finally {
      setPredicting(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-12 bg-surface/50 rounded rounded-xl"></div>
      <div className="h-12 bg-surface/50 rounded rounded-xl"></div>
      <div className="h-12 bg-surface/50 rounded rounded-xl"></div>
    </div>;
  }

  if (error) {
    return <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">{error}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metadata?.columns.map(col => {
          // Show exactly 6 inputs per user request
          const visibleFields = ['Area', 'Item', 'Year', 'Source', 'Unit', 'Value'];
          if(!visibleFields.includes(col)) return null;

          const options = metadata.categories[col];
          const isCategory = !!options;

          return (
            <div key={col} className="space-y-2">
              <label className="text-sm font-medium text-text/80">{col}</label>
              {isCategory ? (
                <select 
                  className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-accent transition-colors appearance-none"
                  value={formData[col] || ''}
                  onChange={(e) => handleChange(col, e.target.value)}
                  required
                >
                  <option value="">Select {col}</option>
                  {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : (
                <input 
                  type="number"
                  step="any"
                  className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-accent transition-colors"
                  placeholder={col === 'Value' ? 'e.g., 5000.5 (Emission Amount)' : `Enter ${col}`}
                  value={formData[col] || ''}
                  onChange={(e) => handleChange(col, e.target.value)}
                  required
                />
              )}
            </div>
          );
        })}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={predicting}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-secondary to-primary text-white font-semibold shadow-lg relative overflow-hidden group"
      >
        <span className="relative z-10">{predicting ? 'Analyzing Matrix...' : 'Run KNN Prediction'}</span>
        <div className="absolute inset-0 bg-accent/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
      </motion.button>
    </form>
  );
}
