import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Home from './pages/Home';
import Prediction from './pages/Prediction';
import Analytics from './pages/Analytics';
import About from './pages/About';
import History from './pages/History';
import ParticleBackground from './components/ParticleBackground';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-text flex flex-col font-sans overflow-x-hidden pt-20">
        <Header />
        <main className="flex-grow z-10 relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/predict" element={<Prediction />} />
            <Route path="/history" element={<History />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        
        {/* Advanced Animated Image Background */}
        <div className="fixed inset-0 z-[0] pointer-events-none overflow-hidden bg-background">
          <motion.div 
            animate={{ 
              scale: [1.05, 1.15, 1.05],
              rotate: [0, 2, 0, -2, 0],
              opacity: [0.15, 0.25, 0.15]
            }}
            transition={{ 
              duration: 40, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-[-10%] bg-cover bg-center mix-blend-screen opacity-20 contrast-125 grayscale"
            style={{ backgroundImage: "url('/bg-mesh.png')" }}
          />
          {/* Subtle vignette/gradient overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background/95 z-[2]"></div>
          
          {/* Interactive Particle Network */}
          <ParticleBackground />
        </div>
      </div>
    </Router>
  );
}

export default App;
