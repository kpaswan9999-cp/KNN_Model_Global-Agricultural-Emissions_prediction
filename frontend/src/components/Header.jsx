import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Activity, BarChart2, Info } from 'lucide-react';

export default function Header() {
  const location = useLocation();

  const links = [
    { to: '/', label: 'Home', icon: Leaf },
    { to: '/predict', label: 'Prediction', icon: Activity },
    { to: '/analytics', label: 'Analytics', icon: BarChart2 },
    { to: '/about', label: 'About', icon: Info },
  ];

  return (
    <header className="fixed top-0 w-full z-50 glass-panel border-b border-white/10">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/favicon.png" alt="EcoPredict AI Logo" className="w-8 h-8 rounded-lg shadow-lg shadow-accent/20" />
          <span className="text-2xl font-bold tracking-wider text-text bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
            EcoPredict
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link key={link.to} to={link.to} className="relative group flex items-center gap-2 text-text/80 hover:text-white transition-colors duration-300">
              <link.icon className="w-4 h-4 group-hover:text-accent transition-colors" />
              <span>{link.label}</span>
              {location.pathname === link.to && (
                <motion.div 
                  layoutId="underline" 
                  className="absolute left-0 top-full mt-1 w-full h-[2px] bg-accent rounded-full" 
                />
              )}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
