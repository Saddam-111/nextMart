import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AnimatedAccordion = ({ isOpen, onToggle, title, children, className = '' }) => {
  return (
    <div className={`border rounded-2xl overflow-hidden bg-white ${className}`}>
      <motion.button
        whileHover={{ scale: 1.01, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
        whileTap={{ scale: 0.99, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
        onClick={onToggle}
        className="w-full text-left px-4 py-3 font-semibold bg-[#f3efe8] flex items-center justify-between hover:bg-[#e8e0d3] transition-all-slow organic-btn"
      >
        <span className="font-display text-[#3d352b]">{title}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-[#9e866b]"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.span>
        </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3 space-y-2 bg-white">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedAccordion;