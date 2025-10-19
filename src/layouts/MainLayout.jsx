import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Outlet, useLocation } from 'react-router-dom'; // Note: import from react-router-dom
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import ScrollToTop from '../components/ScrollToTop';

// appease linter: make sure imported motion is referenced as a value
const _MOTION_USED = motion;

const transitionProps = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2 },
};

const MainLayout = () => {
  const location = useLocation();

  useEffect(() => {
    // Tawk.to Script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `
      var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
      (function(){
      var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
      s1.async=true;
      s1.src='https://embed.tawk.to/68f45dd35198b11947901c5b/1j7t8t1gj';
      s1.charset='UTF-8';
      s1.setAttribute('crossorigin','*');
      s0.parentNode.insertBefore(s1,s0);
      })();
    `;
    document.head.appendChild(script);

    return () => {
      // Cleanup function to remove script when component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
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