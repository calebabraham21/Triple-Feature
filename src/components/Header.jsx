import { motion } from 'framer-motion';
import { List, Home, Info, Menu, X, Sparkles, Code, Mail, ExternalLink, Linkedin, Github, User, LogOut } from 'lucide-react';
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
    { id: 'top-picks', label: 'Top Picks', icon: Sparkles },
    { id: 'about-me', label: 'About Me', icon: Info },
  ];

  const rightNavItems = [
    { id: 'projects', label: 'Projects', icon: Code },
    { id: 'contact', label: 'Contact', icon: Mail },
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

  const handleNavigation = (page) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    // Show confirmation popup first
    onSignOutRequest();
  };

  const renderNavButton = (item) => {
    const Icon = item.icon;
    const isActive = currentPage === item.id;
    
    // Special handling for contact button with dropdown
    if (item.id === 'contact') {
      return (
        <div key={item.id} className="relative group">
          <motion.button
            whileHover={{}}
            whileTap={{}}
            onClick={(e) => e.preventDefault()}
            className={`relative inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium border trace-snake trace-snake--rb transition-colors transition-shadow duration-300 ${
              isActive ? 'bg-cinema-gray text-white border-cinema-light' : 'bg-cinema-black text-white border-cinema-light'
            } hover:bg-white/5 hover:shadow-lg hover:shadow-accent-blue/10`}
          >
            <Icon size={16} />
            <span className="hidden lg:inline">{item.label}</span>
            <span className="trace-line trace-line--t" />
            <span className="trace-line trace-line--r" />
            <span className="trace-line trace-line--b" />
            <span className="trace-line trace-line--l" />
          </motion.button>
          
          {/* Contact Dropdown */}
          <div className="absolute right-0 top-full w-64 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
            <div className="bg-black/90 backdrop-blur-md border border-white/20 rounded-lg shadow-xl p-4">
              <div className="space-y-3">
                <a
                  href="mailto:calebabraham21@gmail.com"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors group/item"
                >
                  <Mail size={18} className="text-accent-red" />
                  <div>
                    <div className="text-sm font-medium text-white group-hover/item:text-accent-red transition-colors">Email</div>
                    <div className="text-xs text-white/70">calebabraham21@gmail.com</div>
                  </div>
                </a>
                
                <a
                  href="https://www.linkedin.com/in/caleb-abraham-3900b9281/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors group/item"
                >
                  <Linkedin size={18} className="text-accent-blue" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white group-hover/item:text-accent-blue transition-colors">LinkedIn</div>
                    <div className="text-xs text-white/70">Professional profile</div>
                  </div>
                  <ExternalLink size={14} className="text-white/50" />
                </a>
                
                <a
                  href="https://github.com/calebabraham21"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors group/item"
                >
                  <Github size={18} className="text-accent-purple" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white group-hover/item:text-accent-purple transition-colors">GitHub</div>
                    <div className="text-xs text-white/70">Code repositories</div>
                  </div>
                  <ExternalLink size={14} className="text-white/50" />
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <motion.button
        key={item.id}
        whileHover={{}}
        whileTap={{}}
        onClick={() => handleNavigation(item.id)}
        className={`relative inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium border trace-snake trace-snake--rb transition-colors transition-shadow duration-300 ${
          isActive ? 'bg-cinema-gray text-white border-cinema-light' : 'bg-cinema-black text-white border-cinema-light'
        } hover:bg-white/5 hover:shadow-lg hover:shadow-accent-blue/10`}
      >
        <Icon size={16} />
        <span className="hidden lg:inline">{item.label}</span>
        <span className="trace-line trace-line--t" />
        <span className="trace-line trace-line--r" />
        <span className="trace-line trace-line--b" />
        <span className="trace-line trace-line--l" />
      </motion.button>
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
        <div className="max-w-5xl mx-auto px-8 flex items-center justify-between">
          {/* Left Navigation - Movie App Links */}
          <motion.nav
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            {leftNavItems.map(renderNavButton)}
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
            className="flex items-center gap-2"
          >
            {rightNavItems.map(renderNavButton)}
            
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden mx-4 mb-4 bg-cinema-dark/95 backdrop-blur-md border border-cinema-gray rounded-lg shadow-xl p-4"
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
                    <motion.button
                      key={item.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleNavigation(item.id)}
                      className={`flex items-center gap-2 w-full px-2 py-2 rounded text-sm font-medium transition-colors ${
                        isActive 
                          ? 'bg-cinema-gray text-white' 
                          : 'text-white hover:text-white hover:bg-cinema-gray/50'
                      }`}
                    >
                      <Icon size={16} />
                      {item.label}
                    </motion.button>
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
                    <motion.button
                      key={item.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleNavigation(item.id)}
                      className={`flex items-center gap-2 w-full px-2 py-2 rounded text-sm font-medium transition-colors ${
                        isActive 
                          ? 'bg-cinema-gray text-white' 
                          : 'text-white hover:text-white hover:bg-cinema-gray/50'
                      }`}
                    >
                      <Icon size={16} />
                      {item.label}
                    </motion.button>
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
                    className="flex items-center gap-2 w-full px-2 py-2 rounded text-sm font-medium text-white/50 cursor-not-allowed"
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
                      className={`flex items-center gap-2 w-full px-2 py-2 rounded text-sm font-medium transition-colors ${
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
                      onClick={handleSignOut}
                      className="flex items-center gap-2 w-full px-2 py-2 rounded text-sm font-medium text-white hover:text-white hover:bg-cinema-gray/50"
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
                    className="flex items-center gap-2 w-full px-2 py-2 rounded text-sm font-medium text-white hover:text-white hover:bg-cinema-gray/50"
                  >
                    <User size={16} />
                    Sign In
                  </motion.button>
                )}
              </div>
            </div>
          </nav>
        </motion.div>
      )}

    </header>
  );
};

export default Header;
