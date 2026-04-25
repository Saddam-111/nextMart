import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { dropdownVariants } from '../../lib/animations';

const AnimatedDropdown = ({ isOpen, children, className = '', anchor = 'right' }) => {
  const anchorClasses = {
    right: 'right-0',
    left: 'left-0',
    center: 'left-1/2 -translate-x-1/2'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={dropdownVariants}
          className={`absolute top-full mt-2 ${anchorClasses[anchor]} ${className}`}
          style={{ zIndex: 100 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedDropdown;