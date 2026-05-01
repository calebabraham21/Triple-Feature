import { motion } from 'framer-motion';
import { Home, Info, Menu, X, Sparkles } from 'lucide-react';
import { useState, useLayoutEffect, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import TripFeatLogo from '../../TripFeatLogo.png';


const Header = ({ currentPage, onNavigate, onHomeNavigation }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef(null);

  const navigate = useNavigate();

  const leftNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'editors-choice', label: 'Editor\'s Choice', icon: Sparkles },
  ];

  const rightNavItems = [
    { id: 'about-me', label: 'About Me', icon: Info },
  ];

  useLayoutEffect(() => {
    const updateNavHeight = () => {
      const height = navRef.current?.offsetHeight || 80;
      document.documentElement.style.setProperty('--nav-height', `${height}px`);
    };

    updateNavHeight();
    window.addEventListener('resize', updateNavHeight);

    return () => window.removeEventListener('resize', updateNavHeight);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      const scrollY = window.scrollY;

      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      const scrollableElements = document.querySelectorAll('*');
      scrollableElements.forEach(element => {
        if (getComputedStyle(element).overflow === 'auto' || getComputedStyle(element).overflow === 'scroll') {
          element.style.overflow = 'hidden';
        }
      });
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';

      const scrollableElements = document.querySelectorAll('*');
      scrollableElements.forEach(element => {
        if (element.style.overflow === 'hidden') {
          element.style.overflow = '';
        }
      });

      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
      }
    }

    return () => {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';

      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
      }
    };
  }, [isMobileMenuOpen]);

  const handleNavigation = (page) => {
    if (page === 'home') {
      if (onHomeNavigation) {
        onHomeNavigation();
        return;
      }
    }

    onNavigate(page);
    setIsMobileMenuOpen(false);

    switch (page) {
      case 'home':
        navigate('/');
        break;
      case 'editors-choice':
        navigate('/editors-choice');
        break;
      case 'about-me':
        navigate('/about-me');
        break;
      default:
        navigate('/');
    }
  };

  const renderNavLink = (item) => {
    const Icon = item.icon;
    const isActive = currentPage === item.id;

    return (
      <motion.a
        key={item.id}
        href="#"
        onClick={(e) => {
          e.preventDefault();
          handleNavigation(item.id);
        }}
        className={`relative inline-flex items-center gap-2 px-3 py-2 text-base font-medium transition-all duration-300 cursor-pointer group ${
          isActive ? 'text-accent-blue' : 'text-white/80'
        } hover:text-white hover:scale-105`}
        whileHover={{ y: -2 }}
      >
        <Icon size={16} className="transition-transform duration-300 group-hover:rotate-12" />
        <span className="hidden lg:inline relative">
          {item.label}
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-accent-blue to-accent-purple transition-all duration-300 group-hover:w-full"></span>
        </span>
      </motion.a>
    );
  };

  return (
    <header ref={navRef} className="site-nav fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/10">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="/movie-posters.jpg"
          alt=""
          className="w-full h-full object-cover blur-lg opacity-40 scale-110"
        />
      </div>
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-accent-red/10 via-accent-purple/15 to-accent-blue/10" />

      <div className="hidden md:block py-4 relative z-10">
        <div className="max-w-5xl mx-auto px-12 flex items-center justify-center relative">
          <motion.nav
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 absolute left-8"
          >
            {leftNavItems.map(renderNavLink)}
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="cursor-pointer"
            onClick={() => {
              if (onHomeNavigation) {
                onHomeNavigation();
              } else {
                handleNavigation('home');
              }
            }}
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={TripFeatLogo}
              alt="Triple Feature"
              className="h-20 w-auto object-contain drop-shadow-lg"
            />
          </motion.div>

          <motion.nav
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 absolute right-8"
          >
            {rightNavItems.map(renderNavLink)}
          </motion.nav>
        </div>
      </div>

      <div className="md:hidden flex items-center justify-between px-4 py-3 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="cursor-pointer"
          onClick={() => {
            if (onHomeNavigation) {
              onHomeNavigation();
            } else {
              handleNavigation('home');
            }
          }}
          whileHover={{ scale: 1.05 }}
        >
          <img
            src={TripFeatLogo}
            alt="Triple Feature"
            className="h-16 w-auto object-contain drop-shadow-lg"
          />
        </motion.div>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleMobileMenu}
          type="button"
          className="p-3 bg-cinema-black/80 backdrop-blur-sm border border-cinema-light rounded-lg text-white hover:bg-cinema-gray transition-colors"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </motion.button>
      </div>

      {isMobileMenuOpen && createPortal(
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[99998]"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="md:hidden fixed top-0 right-0 w-4/5 h-full bg-cinema-dark/95 backdrop-blur-md border-l border-cinema-gray shadow-2xl z-[99999] overflow-y-auto"
          >
            <div className="flex justify-end p-4 border-b border-cinema-gray/30">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 bg-cinema-gray/50 hover:bg-cinema-gray/70 rounded-lg text-white transition-colors"
              >
                <X size={20} />
              </motion.button>
            </div>

            <nav className="flex flex-col space-y-6 p-4">
              <div>
                <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3 px-2">App & About</h4>
                <div className="space-y-2">
                  {leftNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;

                    return (
                      <motion.a
                        key={item.id}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavigation(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                          isActive
                            ? 'text-accent-blue bg-accent-blue/10 border border-accent-blue/20'
                            : 'text-white/80 hover:text-white hover:bg-white/5'
                        }`}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon size={18} />
                        {item.label}
                      </motion.a>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3 px-2">Portfolio</h4>
                <div className="space-y-2">
                  {rightNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;

                    return (
                      <motion.a
                        key={item.id}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavigation(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                          isActive
                            ? 'text-accent-blue bg-accent-blue/10 border border-accent-blue/20'
                            : 'text-white/80 hover:text-white hover:bg-white/5'
                        }`}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon size={18} />
                        {item.label}
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </nav>
          </motion.div>
        </>,
        document.body,
      )}

    </header>
  );
};

export default Header;
