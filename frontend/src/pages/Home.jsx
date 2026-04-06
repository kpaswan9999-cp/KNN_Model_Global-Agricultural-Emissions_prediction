import React from 'react';
import Hero from '../components/Hero';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div>
      <Hero />
      <div className="container mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Global Dataset', desc: 'Trained on comprehensive FAO data tracking agricultural emissions.', delay: 0.1 },
            { title: 'KNN Algorithm', desc: 'K-Nearest Neighbors evaluates similarities in vectors to classify exact emission types.', delay: 0.3 },
            { title: 'Real-Time Insights', desc: 'Instant predictions with confidence scoring based on historical correlations.', delay: 0.5 }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: feature.delay, duration: 0.5 }}
              viewport={{ once: true }}
              className="glass-panel p-8 rounded-3xl"
            >
              <h3 className="text-xl font-bold mb-4 text-accent">{feature.title}</h3>
              <p className="text-text/70 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
