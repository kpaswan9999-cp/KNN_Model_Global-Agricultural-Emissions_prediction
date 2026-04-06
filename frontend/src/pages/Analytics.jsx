import React from 'react';
import { motion } from 'framer-motion';
import Dashboard from '../components/Dashboard';

export default function Analytics() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-6 py-12"
    >
      <div className="mb-8 text-center">
         <h1 className="text-3xl font-bold mb-2">Global Emissions Analytics</h1>
         <p className="text-text/60 max-w-2xl mx-auto">Visualize the real-world agricultural greenhouse gas emission data used to train our K-Nearest Neighbors AI model.</p>
      </div>
      <Dashboard />
    </motion.div>
  );
}
