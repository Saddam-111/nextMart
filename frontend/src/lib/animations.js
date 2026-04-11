import { easeOut } from "framer-motion";

export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: easeOut }
  },
  exit: { opacity: 0, y: -10 }
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.5, ease: easeOut }
  },
  exit: { opacity: 0 }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: easeOut }
  }
};

export const scaleHover = {
  whileHover: { scale: 1.03 },
  transition: { duration: 0.3, ease: easeOut }
};

export const slideDown = {
  initial: { opacity: 0, y: -10, scale: 0.98 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.3, ease: easeOut }
  },
  exit: { 
    opacity: 0, 
    y: -10, 
    scale: 0.98,
    transition: { duration: 0.25, ease: easeOut }
  }
};

export const modalAnimation = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: easeOut }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: 0.3, ease: easeOut }
  }
};

export const cardHover = {
  initial: { y: 0 },
  whileHover: { 
    y: -6,
    transition: { duration: 0.4, ease: easeOut }
  }
};

export const imageZoom = {
  whileHover: { scale: 1.05 },
  transition: { duration: 0.7, ease: easeOut }
};

export const buttonTap = {
  whileTap: { scale: 0.97 },
  transition: { duration: 0.2 }
};

export const smoothFade = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.8, ease: easeOut }
  }
};

export const floating = {
  animate: {
    y: [0, -5, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const breathe = {
  animate: {
    scale: [1, 1.02, 1],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const springNav = {
  initial: { x: -20, opacity: 0 },
  animate: { 
    x: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  },
  exit: { 
    x: -20, 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

export const dropdownVariants = {
  hidden: { 
    opacity: 0, 
    y: -10, 
    scale: 0.98 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 35,
      mass: 0.8
    }
  },
  exit: { 
    opacity: 0, 
    y: -10, 
    scale: 0.98,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
};

export const mobileMenuVariants = {
  hidden: { 
    opacity: 0, 
    height: 0 
  },
  visible: { 
    opacity: 1, 
    height: "auto",
    transition: {
      duration: 0.4,
      ease: easeOut,
      staggerChildren: 0.05,
      when: "beforeChildren"
    }
  },
  exit: { 
    opacity: 0, 
    height: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

export const mobileMenuItem = {
  hidden: { 
    opacity: 0, 
    x: -10 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3 }
  }
};

export const heroFade = {
  initial: { opacity: 0, scale: 1.05 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 1, ease: easeOut }
  },
  exit: { 
    opacity: 0, 
    scale: 1.05,
    transition: { duration: 0.5 }
  }
};

export const productGridStagger = {
  animate: {
    transition: {
      staggerChildren: 0.08
    }
  }
};