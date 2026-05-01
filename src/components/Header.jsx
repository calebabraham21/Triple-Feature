import { motion, AnimatePresence } from 'framer-motion';
import { Home, Info, Menu, X, Sparkles, Search } from 'lucide-react';
import { useState, useLayoutEffect, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import TripFeatLogo from '../../TripFeatLogo.png';

const Header = ({ currentPage, onNavigate, onHomeNavigation, onProtectedNavRequest }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef(null);

  const navigate = useNavigate();
  const listVariants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.025 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 6, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.16, ease: 'easeOut' } },
  };

  const leftNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'editors-choice', label: 'Editor\'s Choice', icon: Sparkles },
    { id: 'picks', label: 'Picks', icon: Search },
  ];

  const rightNavItems = [{ id: 'about-me', label: 'About Me', icon: Info }];

  const allNavItems = [...leftNavItems, ...rightNavItems];

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
      scrollableElements.forEach((element) => {
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
      scrollableElements.forEach((element) => {
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

  const goPath = (path) => {
    if (onProtectedNavRequest) {
      onProtectedNavRequest(path);
    } else {
      navigate(path);
    }
  };

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
        goPath('/editors-choice');
        break;
      case 'picks':
        goPath('/picks');
        break;
      case 'about-me':
        goPath('/about-me');
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

      <div className="hidden md:block py-2.5 relative z-10">
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
              className="h-16 w-auto object-contain drop-shadow-lg"
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

      <div className="md:hidden flex items-center justify-between px-4 py-2 relative z-10">
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
            className="h-14 w-auto object-contain drop-shadow-lg"
          />
        </motion.div>

        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleMobileMenu}
          className="p-2.5 bg-cinema-black/80 backdrop-blur-sm border border-cinema-light rounded-lg text-white hover:bg-cinema-gray transition-colors"
          title={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </motion.button>
      </div>

      {createPortal(
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                key="mobile-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12, ease: 'linear' }}
                className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[99998]"
                onClick={() => setIsMobileMenuOpen(false)}
              />

              <motion.div
                key="mobile-sidebar"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.07, ease: [0.2, 0.9, 0.3, 1] }}
                className="md:hidden fixed top-0 right-0 w-4/5 h-full z-[99999] overflow-y-auto"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(4px)',
                  borderLeft: '1px solid rgba(255,255,255,0.15)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  willChange: 'transform, opacity',
                  transform: 'translateZ(0)',
                }}
              >
                <div className="flex justify-end p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg text-white transition-colors"
                    style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                  >
                    <X size={20} />
                  </motion.button>
                </div>

                <motion.nav className="flex flex-col p-5" initial="hidden" animate="show" variants={listVariants}>
                  <div className="space-y-2">
                    {allNavItems.map((item) => {
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
                          className={`flex items-center gap-3.5 w-full px-4 py-3.5 rounded-md text-lg transition-colors duration-150 ${
                            isActive ? 'text-accent-blue' : 'text-white/85 hover:text-white'
                          }`}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          variants={itemVariants}
                        >
                          <Icon size={20} />
                          {item.label}
                        </motion.a>
                      );
                    })}
                  </div>
                </motion.nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </header>
  );
};

export default Header;
