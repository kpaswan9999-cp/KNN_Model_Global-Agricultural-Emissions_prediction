import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Server, Database } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: 'spring', stiffness: 100, damping: 15 }
  }
};

export default function About() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl min-h-[80vh] flex items-center justify-center">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="glass-panel p-10 md:p-16 rounded-[2.5rem] relative overflow-hidden w-full"
      >
        {/* Decorative Background Blobs */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-accent/20 rounded-full blur-[80px]"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-secondary/20 rounded-full blur-[80px]"></div>

        <motion.div variants={itemVariants} className="relative z-10">
          <div className="inline-flex items-center justify-center p-3 glass-panel rounded-2xl mb-6 shadow-xl shadow-accent/5">
            <Leaf className="w-8 h-8 text-accent animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-accent to-white">
            About EcoPredict
          </h1>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-6 text-text/80 leading-relaxed text-lg relative z-10 mb-12">
          <div className="border-l-4 border-accent pl-6 bg-black/10 py-4 rounded-r-2xl border border-y-white/5 border-r-white/5">
            <p>
              EcoPredict is an advanced AI-driven platform designed to forecast agricultural greenhouse gas emissions. Utilizing a K-Nearest Neighbors (KNN) classification algorithm, our system accurately predicts the primary emission elements resulting from various agricultural activities wordwide.
            </p>
          </div>
          <p className="px-2">
            Our models are trained on extensive <strong className="text-white">Food and Agriculture Organization (FAO) TIER 1</strong> data spanning over decades. By leveraging machine learning, we aim to provide actionable insights for researchers, environmentalists, and policymakers striving to reach net-zero carbon goals.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="relative z-10 border-t border-white/10 pt-10">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Server className="w-6 h-6 text-secondary" />
            Technology Stack
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-accent/50 transition-colors shadow-lg shadow-black/20"
            >
              <h3 className="font-bold text-accent mb-2">Frontend</h3>
              <p className="text-sm text-text/60">React, Vite, Tailwind CSS, Framer Motion, Recharts</p>
            </motion.div>
            
            <motion.div 
               whileHover={{ scale: 1.05, y: -5 }}
               whileTap={{ scale: 0.95 }}
              className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-accent/50 transition-colors shadow-lg shadow-black/20"
            >
              <h3 className="font-bold text-accent mb-2">Backend</h3>
              <p className="text-sm text-text/60">Python, Flask, Pandas, Scikit-Learn</p>
            </motion.div>

            <motion.div 
               whileHover={{ scale: 1.05, y: -5 }}
               whileTap={{ scale: 0.95 }}
              className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-accent/50 transition-colors shadow-lg shadow-black/20"
            >
              <h3 className="font-bold text-accent mb-2 flex items-center gap-2">
                <Database className="w-4 h-4" />
                AI Model
              </h3>
              <p className="text-sm text-text/60">Optimized KNN Classifier layered with StandardScaler</p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
