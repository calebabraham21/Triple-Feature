import { motion } from 'framer-motion';
import { List, Home, Info, Menu, X, Sparkles, User, LogOut } from 'lucide-react';
import { useState, useLayoutEffect, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TripFeatLogo from '../../TripFeatLogo.png';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';


const Header = ({ currentPage, onNavigate, onSignOutRequest }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef(null);
  const { user, isAuthenticated, loading } = useAuth();

  const navigate = useNavigate();
  
  const leftNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'editors-choice', label: 'Editor\'s Choice', icon: Sparkles },
  ];

  const rightNavItems = [
    { id: 'about-me', label: 'About Me', icon: Info },
  ];

  const allNavItems = [...leftNavItems, ...rightNavItems];

  // Set CSS variable for nav height to prevent content overlap
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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleNavigation = (page) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
    
    // Handle navigation to specific routes
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

  const handleSignOut = async () => {
    // Show confirmation popup first
    onSignOutRequest();
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
          {/* Underline effect on hover */}
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-accent-blue to-accent-purple transition-all duration-300 group-hover:w-full"></span>
        </span>
      </motion.a>
    );
  };

  return (
    <header ref={navRef} className="site-nav fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/10">
      {/* Movie posters background - super blurred */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="/movie-posters.jpg"
          alt=""
          className="w-full h-full object-cover blur-lg opacity-40 scale-110"
        />
      </div>
      {/* Dark overlay to block content behind */}
      <div className="absolute inset-0 bg-black/60" />
      {/* Sexy gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent-red/10 via-accent-purple/15 to-accent-blue/10" />
      
      {/* Desktop Navigation - Symmetrical Layout */}
      <div className="hidden md:block py-4 relative z-10">
        <div className="max-w-5xl mx-auto px-12 flex items-center justify-center relative">
          {/* Left Navigation - Movie App Links */}
          <motion.nav
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 absolute left-8"
          >
            {leftNavItems.map(renderNavLink)}
          </motion.nav>

          {/* Center Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="cursor-pointer"
            onClick={() => handleNavigation('home')}
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={TripFeatLogo}
              alt="Triple Feature"
              className="h-20 w-auto object-contain drop-shadow-lg"
            />
          </motion.div>

          {/* Right Navigation - Personal/Portfolio Links */}
          <motion.nav
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 absolute right-8"
          >
            {rightNavItems.map(renderNavLink)}
            
            {/* Authentication Button */}
            <div className="ml-2">
              {loading ? (
                <motion.button
                  whileHover={{}}
                  whileTap={{}}
                  disabled
                  className="relative inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium border trace-snake trace-snake--rb transition-colors transition-shadow duration-300 bg-cinema-gray text-white/50 border-cinema-light cursor-not-allowed"
                >
                  <User size={16} />
                  <span className="hidden lg:inline">Loading...</span>
                  <span className="trace-line trace-line--t" />
                  <span className="trace-line trace-line--r" />
                  <span className="trace-line trace-line--b" />
                  <span className="trace-line trace-line--l" />
                </motion.button>
              ) : isAuthenticated ? (
                <div className="relative group">
                  <motion.button
                    whileHover={{}}
                    whileTap={{}}
                    className="relative inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium border trace-snake trace-snake--rb transition-colors transition-shadow duration-300 bg-accent-blue text-white border-accent-blue hover:bg-accent-blue/80"
                  >
                    <User size={16} />
                    <span className="hidden lg:inline">
                      {user?.user_metadata?.name || 'Account'}
                    </span>
                    <span className="trace-line trace-line--t" />
                    <span className="trace-line trace-line--r" />
                    <span className="trace-line trace-line--b" />
                    <span className="trace-line trace-line--l" />
                  </motion.button>
                  
                  {/* User Dropdown */}
                  <div className="absolute right-0 top-full w-48 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
                    <div className="bg-black/90 backdrop-blur-md border border-white/20 rounded-lg shadow-xl p-2">
                      <button
                        onClick={() => {
                          if (!loading && isAuthenticated) {
                            handleNavigation('watchlist');
                            navigate('/watchlist');
                          }
                        }}
                        disabled={loading || !isAuthenticated}
                        className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
                          loading || !isAuthenticated 
                            ? 'text-white/50 cursor-not-allowed' 
                            : 'text-white hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <List size={18} className="text-accent-gold" />
                        <span>My Watchlist</span>
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-white/10 transition-colors text-white"
                      >
                        <LogOut size={18} className="text-accent-red" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <motion.button
                  whileHover={{}}
                  whileTap={{}}
                  onClick={() => {
                    navigate('/auth');
                  }}
                  className="relative inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium border trace-snake trace-snake--rb transition-colors transition-shadow duration-300 bg-cinema-gray text-white border-cinema-light hover:bg-accent-blue hover:border-accent-blue"
                >
                  <User size={16} />
                  <span className="hidden lg:inline">Sign In</span>
                  <span className="trace-line trace-line--t" />
                  <span className="trace-line trace-line--r" />
                  <span className="trace-line trace-line--b" />
                  <span className="trace-line trace-line--l" />
                </motion.button>
              )}
            </div>
          </motion.nav>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 relative z-10">
        {/* Mobile Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="cursor-pointer"
          onClick={() => handleNavigation('home')}
          whileHover={{ scale: 1.05 }}
        >
          <img
            src={TripFeatLogo}
            alt="Triple Feature"
            className="h-16 w-auto object-contain drop-shadow-lg"
          />
        </motion.div>

        {/* Mobile Hamburger Menu */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleMobileMenu}
          className="p-3 bg-cinema-black/80 backdrop-blur-sm border border-cinema-light rounded-lg text-white hover:bg-cinema-gray transition-colors"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </motion.button>
      </div>

      {/* Mobile Menu - Absolutely positioned overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu content */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-full left-0 right-0 bg-cinema-dark/95 backdrop-blur-md border-b border-cinema-gray shadow-xl p-4 z-40"
          >
            <nav className="flex flex-col space-y-3">
              {/* Movie App Section */}
              <div>
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">App & About</h4>
                <div className="space-y-1">
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
                        className={`flex items-center gap-2 w-full px-2 py-2 rounded text-base font-medium transition-colors ${
                          isActive 
                            ? 'text-accent-blue' 
                            : 'text-white/80 hover:text-white'
                        }`}
                        whileHover={{ x: 4 }}
                      >
                        <Icon size={16} className="transition-transform duration-300 group-hover:rotate-12" />
                        {item.label}
                      </motion.a>
                    );
                  })}
                </div>
              </div>

              {/* Personal Section */}
              <div>
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">Portfolio</h4>
                <div className="space-y-1">
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
                        className={`flex items-center gap-2 w-full px-2 py-2 rounded text-base font-medium transition-colors ${
                          isActive 
                            ? 'text-accent-blue' 
                            : 'text-white/80 hover:text-white'
                        }`}
                        whileHover={{ x: 4 }}
                      >
                        <Icon size={16} className="transition-transform duration-300 group-hover:rotate-12" />
                        {item.label}
                      </motion.a>
                    );
                  })}
                </div>
              </div>

              {/* Authentication Section */}
              <div>
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">Account</h4>
                <div className="space-y-1">
                  {loading ? (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      disabled
                      className="flex items-center gap-2 w-full px-2 py-2 rounded text-base font-medium text-white/50 cursor-not-allowed"
                    >
                      <User size={16} />
                      Loading...
                    </motion.button>
                  ) : isAuthenticated ? (
                    <>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (!loading && isAuthenticated) {
                            handleNavigation('watchlist');
                            navigate('/watchlist');
                            setIsMobileMenuOpen(false);
                          }
                        }}
                        disabled={loading || !isAuthenticated}
                        className={`flex items-center gap-2 w-full px-2 py-2 rounded text-base font-medium transition-colors ${
                          loading || !isAuthenticated 
                            ? 'text-white/50 cursor-not-allowed' 
                            : 'text-white hover:text-white hover:bg-cinema-gray/50'
                        }`}
                      >
                        <List size={16} className="text-accent-gold" />
                        My Watchlist
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          handleSignOut();
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-2 w-full px-2 py-2 rounded text-base font-medium text-white hover:text-white hover:bg-cinema-gray/50"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </motion.button>
                    </>
                  ) : (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        navigate('/auth');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 w-full px-2 py-2 rounded text-base font-medium text-white hover:text-white hover:bg-cinema-gray/50"
                    >
                      <User size={16} />
                      Sign In
                    </motion.button>
                  )}
                </div>
              </div>
            </nav>
          </motion.div>
        </>
      )}

    </header>
  );
};

export default Header;
