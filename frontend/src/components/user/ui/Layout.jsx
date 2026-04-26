import React from 'react';
import { motion } from 'framer-motion';
import { smoothFade } from '../lib/animations';
import GrainOverlay from './ui/GrainOverlay';

const Layout = ({ children, className = '' }) => {
  return (
    <>
      <GrainOverlay />
      <motion.div
        initial={smoothFade.initial}
        animate={smoothFade.animate}
        className={`min-h-screen ${className}`}
      >
        {children}
      </motion.div>
    </>
  );
};

export default Layout;
