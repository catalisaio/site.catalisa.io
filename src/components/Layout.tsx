import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  useEffect(() => {
    // Smooth scroll to top on route change
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [location.pathname]);

  return (
    <div className="animate-fadeIn">
      {children}
    </div>
  );
};

export default Layout;