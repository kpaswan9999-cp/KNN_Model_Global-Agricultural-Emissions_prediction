import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative overflow-hidden pt-24 pb-32 lg:pt-36 flex items-center justify-center min-h-[80vh]">
      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 border-accent/30 text-sm">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            <span className="text-gray-300">New KNN Model Deployed</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Predict Agricultural<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary">
              Emissions with AI
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-text/70 max-w-2xl mx-auto mb-12">
            Harness the power of K-Nearest Neighbors to predict and analyze CO2, CH4, and N2O emissions across different countries and items based on historical data.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/predict"
              className="px-8 py-4 rounded-xl bg-accent text-background font-semibold hover:bg-accent/90 transition-all shadow-[0_0_20px_rgba(244,162,97,0.3)] hover:shadow-[0_0_30px_rgba(244,162,97,0.5)] flex items-center gap-2 group w-full sm:w-auto justify-center"
            >
              Start Predicting
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/analytics"
              className="px-8 py-4 rounded-xl glass-panel text-white hover:bg-white/10 transition-colors w-full sm:w-auto justify-center flex font-medium"
            >
              View Analytics
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
