import React from 'react';

const GlassCard = ({ children, className = '', onClick, ...props }) => {
  return (
    <div
      className={`glass glass-hover neon-glow rounded-3xl p-8 shadow-2xl border border-white/10 dark:border-indigo-500/30 backdrop-blur-glass transition-all duration-500 hover:shadow-neon-pulse hover:-translate-y-2 hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
