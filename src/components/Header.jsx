import { motion } from 'framer-motion';
import { List, Home, Info } from 'lucide-react';

const Header = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'watchlist', label: 'Watchlist', icon: List },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-cinema-black/95 backdrop-blur-md border-b border-cinema-gray"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Title only */}
          <motion.div
            whileHover={{ scale: 1.0 }}
            className="flex items-center cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <h1 className="text-xl font-bold text-white">Triple Feature</h1>
          </motion.div>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  whileHover={{}}
                  whileTap={{}}
                  onClick={() => onNavigate(item.id)}
                  className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border trace-snake trace-snake--rb ${
                    isActive ? 'bg-cinema-gray text-white border-cinema-light' : 'bg-cinema-black text-white border-cinema-light'
                  }`}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{item.label}</span>
                  <span className="trace-line trace-line--t" />
                  <span className="trace-line trace-line--r" />
                  <span className="trace-line trace-line--b" />
                  <span className="trace-line trace-line--l" />
                </motion.button>
              );
            })}
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
