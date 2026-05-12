import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState, useLayoutEffect, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';

const Header = ({ currentPage, onNavigate, onHomeNavigation, onProtectedNavRequest }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef(null);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const updateNavHeight = () => {
      const height = navRef.current?.offsetHeight || 64;
      document.documentElement.style.setProperty('--nav-height', `${height}px`);
    };
    updateNavHeight();
    window.addEventListener('resize', updateNavHeight);
    return () => window.removeEventListener('resize', updateNavHeight);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
    }
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
    };
  }, [isMobileMenuOpen]);

  const goPath = (path) => {
    if (onProtectedNavRequest) onProtectedNavRequest(path);
    else navigate(path);
  };

  const handleNavigation = (page) => {
    if (page === 'home') {
      if (onHomeNavigation) { onHomeNavigation(); return; }
    }
    onNavigate(page);
    setIsMobileMenuOpen(false);
    switch (page) {
      case 'home': navigate('/'); break;
      case 'about-me': goPath('/about-me'); break;
      default: navigate('/');
    }
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about-me', label: 'About' },
  ];

  return (
    <header ref={navRef} className="fixed top-0 left-0 right-0 z-50 bg-frame/95 backdrop-blur-sm border-b border-smoke">

      {/* Desktop */}
      <div className="hidden md:flex items-center justify-between h-16 max-w-5xl mx-auto px-8">
        <button
          type="button"
          onClick={() => onHomeNavigation ? onHomeNavigation() : handleNavigation('home')}
          className="font-cinema text-xl font-medium tracking-tight text-ink hover:opacity-60 transition-opacity"
        >
          Triple Feature
        </button>

        <nav className="flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigation(item.id)}
                className={`text-sm font-medium transition-colors relative pb-0.5 ${
                  isActive ? 'text-ink' : 'text-fog hover:text-ink'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-ink" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex items-center justify-between h-14 px-5">
        <button
          type="button"
          onClick={() => onHomeNavigation ? onHomeNavigation() : handleNavigation('home')}
          className="font-cinema text-lg font-medium tracking-tight text-ink"
        >
          Triple Feature
        </button>
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-fog hover:text-ink transition-colors"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {createPortal(
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                key="mobile-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="md:hidden fixed inset-0 bg-ink/25 z-[99998]"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                key="mobile-sidebar"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
                className="md:hidden fixed top-0 right-0 h-full w-3/4 max-w-xs z-[99999] bg-frame border-l border-ash overflow-y-auto"
              >
                <div className="flex justify-between items-center px-5 py-4 border-b border-smoke">
                  <span className="font-cinema text-base font-medium text-ink">Triple Feature</span>
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 text-fog hover:text-ink transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                <nav className="p-5 space-y-0">
                  {navItems.map((item) => {
                    const isActive = currentPage === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => { handleNavigation(item.id); setIsMobileMenuOpen(false); }}
                        className={`w-full text-left py-4 text-base border-b border-smoke last:border-0 transition-colors font-medium ${
                          isActive ? 'text-ink font-cinema' : 'text-fog hover:text-ink'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </header>
  );
};

export default Header;
