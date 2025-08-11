import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet, useLocation } from 'react-router-dom'; // Note: import from react-router-dom
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

// appease linter: make sure imported motion is referenced as a value
const _MOTION_USED = motion;

const transitionProps = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2 },
};

const MainLayout = () => {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <motion.div key={location.pathname} {...transitionProps}>
          <Outlet /> {/* This will render the current route's component */}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;