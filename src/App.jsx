import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import AboutMe from './pages/AboutMe';
import AboutTripleFeature from './pages/AboutTripleFeature';
import EditorsChoicePage from './pages/EditorsChoicePage';
import Footer from './components/Footer';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentStep, setCurrentStep] = useState(1);
  const [showHomeNavigationConfirm, setShowHomeNavigationConfirm] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/') setCurrentPage('home');
    else if (path === '/editors-choice') setCurrentPage('editors-choice');
    else if (path === '/about-me') setCurrentPage('about-me');
  }, []);

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleStepChange = (step) => {
    setCurrentStep(step);
  };

  const handleHomeNavigation = () => {
    if (currentStep === 5) {
      setShowHomeNavigationConfirm(true);
    } else {
      window.location.href = '/';
    }
  };

  const confirmHomeNavigation = () => {
    setShowHomeNavigationConfirm(false);
    window.location.href = '/';
  };

  const cancelHomeNavigation = () => {
    setShowHomeNavigationConfirm(false);
  };

  return (
    <Router>
      <div className="min-h-screen">
        <Header
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onHomeNavigation={handleHomeNavigation}
        />
        <main>
          <Routes>
            <Route path="/" element={<HomePage onStepChange={handleStepChange} />} />
            {/* Legacy authenticated routes removed — bookmarks redirect home */}
            <Route path="/auth" element={<Navigate to="/" replace />} />
            <Route path="/confirm-success" element={<Navigate to="/" replace />} />
            <Route path="/watchlist" element={<Navigate to="/" replace />} />
            <Route path="/about-me" element={<AboutMe />} />
            <Route path="/about-triple" element={<AboutTripleFeature />} />
            <Route path="/editors-choice" element={<EditorsChoicePage />} />
            <Route path="/projects" element={<Navigate to="/about-me#projects" replace />} />
            <Route path="/contact" element={<Navigate to="/about-me#contact" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />

        <AnimatePresence>
          {showHomeNavigationConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90"
              onClick={cancelHomeNavigation}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="bg-cinema-dark border border-cinema-light/30 rounded-2xl p-6 max-w-md w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center mb-6">
                  <AlertTriangle size={48} className="mx-auto text-accent-yellow mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Leave Recommendations?</h3>
                  <p className="text-white/80 text-sm">
                    Are you sure you want to leave these recommendations? You'll need to go through the selection process again.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={cancelHomeNavigation}
                    className="flex-1 px-4 py-2 bg-cinema-gray hover:bg-cinema-light text-white rounded-lg transition-colors"
                  >
                    Stay Here
                  </button>
                  <button
                    type="button"
                    onClick={confirmHomeNavigation}
                    className="flex-1 px-4 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white rounded-lg transition-colors"
                  >
                    Go Home
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
