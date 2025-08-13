import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut } from 'lucide-react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import WatchlistPage from './pages/WatchlistPage';
import AboutMe from './pages/AboutMe';
import AboutTripleFeature from './pages/AboutTripleFeature';
import ProjectsPage from './pages/ProjectsPage';
import EditorsChoicePage from './pages/EditorsChoicePage';
import AuthPage from './pages/AuthPage';
import Footer from './components/Footer';
import { useAuth } from './hooks/useAuth';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  // Debug logging
  console.log('ProtectedRoute:', { isAuthenticated, loading });
  
  // Show loading state while authentication is being determined
  if (loading) {
    console.log('ProtectedRoute: Showing loading state');
    return (
      <div className="min-h-screen cinema-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <h3 className="text-xl font-semibold mb-2 text-white">Loading...</h3>
          <p className="text-white">Please wait while we verify your account.</p>
        </div>
      </div>
    );
  }
  
  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    console.log('ProtectedRoute: Redirecting to auth');
    return <Navigate to="/auth" replace />;
  }
  
  // Show protected content if authenticated
  console.log('ProtectedRoute: Showing protected content');
  return children;
};

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const { signOut } = useAuth();

  // Update current page based on current route
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/') setCurrentPage('home');
    else if (path === '/editors-choice') setCurrentPage('editors-choice');
    else if (path === '/about-me') setCurrentPage('about-me');
    else if (path === '/projects') setCurrentPage('projects');
    else if (path === '/watchlist') setCurrentPage('watchlist');
    else if (path === '/auth') setCurrentPage('auth');
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (showSignOutConfirm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showSignOutConfirm]);

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleSignOutRequest = () => {
    setShowSignOutConfirm(true);
  };

  const confirmSignOut = async () => {
    try {
      await signOut();
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    } catch (error) {
      console.error('Error during sign out:', error);
      window.location.href = '/';
    } finally {
      setShowSignOutConfirm(false);
    }
  };

  const cancelSignOut = () => {
    setShowSignOutConfirm(false);
  };

  return (
    <Router>
      <div className="min-h-screen">
        <Header currentPage={currentPage} onNavigate={handleNavigate} onSignOutRequest={handleSignOutRequest} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/watchlist" element={<ProtectedRoute><WatchlistPage /></ProtectedRoute>} />
            <Route path="/about-me" element={<AboutMe />} />
            <Route path="/about-triple" element={<AboutTripleFeature />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/editors-choice" element={<EditorsChoicePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />

        {/* Sign Out Confirmation Popup */}
        <AnimatePresence>
          {showSignOutConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90"
              onClick={cancelSignOut}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="bg-cinema-dark border border-cinema-light/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center mb-6">
                  <LogOut size={48} className="mx-auto text-accent-red mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Sign Out</h3>
                  <p className="text-white text-sm">
                    Are you sure you want to sign out of your account?
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={cancelSignOut}
                    className="flex-1 px-4 py-2 bg-cinema-gray hover:bg-cinema-light text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmSignOut}
                    className="relative inline-flex items-center justify-center w-full px-4 py-2 bg-accent-red hover:bg-accent-red/80 text-white rounded-lg transition-colors trace-snake trace-snake--rb"
                  >
                    <span>Sign Out</span>
                    <span className="trace-line trace-line--t" />
                    <span className="trace-line trace-line--r" />
                    <span className="trace-line trace-line--b" />
                    <span className="trace-line trace-line--l" />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;
