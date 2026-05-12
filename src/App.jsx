import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import AboutMe from './pages/AboutMe';
import AboutTripleFeature from './pages/AboutTripleFeature';
import Footer from './components/Footer';
import { ToastProvider } from './context/ToastContext';
import Terms from './pages/Terms';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentStep, setCurrentStep] = useState(1);
  const [showLeaveRecommendationsConfirm, setShowLeaveRecommendationsConfirm] = useState(false);
  const [pendingNavigationPath, setPendingNavigationPath] = useState(null);
  const [pendingOnConfirm, setPendingOnConfirm] = useState(null);

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/') setCurrentPage('home');
    else if (path === '/about-me') setCurrentPage('about-me');
  }, []);

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleStepChange = (step) => {
    setCurrentStep(step);
  };

  const handleProtectedNavigation = (path) => {
    if (currentStep === 5) {
      setPendingNavigationPath(path);
      setPendingOnConfirm(null);
      setShowLeaveRecommendationsConfirm(true);
    } else {
      window.location.href = path;
    }
  };

  const handleProtectedAction = (actionCallback) => {
    if (currentStep === 5) {
      setPendingNavigationPath(null);
      setPendingOnConfirm(() => actionCallback);
      setShowLeaveRecommendationsConfirm(true);
    } else {
      actionCallback();
    }
  };

  const confirmLeaveNavigation = () => {
    setShowLeaveRecommendationsConfirm(false);
    if (typeof pendingOnConfirm === 'function') {
      const fn = pendingOnConfirm;
      setPendingOnConfirm(null);
      fn();
      return;
    }
    const path = pendingNavigationPath || '/';
    setPendingNavigationPath(null);
    window.location.href = path;
  };

  const cancelLeaveNavigation = () => {
    setShowLeaveRecommendationsConfirm(false);
    setPendingNavigationPath(null);
    setPendingOnConfirm(null);
  };

  return (
    <Router>
      <ToastProvider>
        <div className="min-h-screen bg-paper">
          <Header
            currentPage={currentPage}
            currentStep={currentStep}
            onNavigate={handleNavigate}
            onHomeNavigation={() => handleProtectedNavigation('/')}
            onProtectedNavRequest={handleProtectedNavigation}
          />
          <main>
            <Routes>
              <Route
                path="/"
                element={
                  <HomePage
                    onStepChange={handleStepChange}
                    onProtectedActionRequest={handleProtectedAction}
                  />
                }
              />
              <Route path="/auth" element={<Navigate to="/" replace />} />
              <Route path="/confirm-success" element={<Navigate to="/" replace />} />
              <Route path="/watchlist" element={<Navigate to="/" replace />} />
              <Route path="/about-me" element={<AboutMe />} />
              <Route path="/about-triple" element={<AboutTripleFeature />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/projects" element={<Navigate to="/about-me#projects" replace />} />
              <Route path="/contact" element={<Navigate to="/about-me#contact" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>

        {/* Leave recommendations confirmation */}
        <AnimatePresence>
          {showLeaveRecommendationsConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-ink/40"
              onClick={cancelLeaveNavigation}
            >
              <motion.div
                initial={{ scale: 0.95, y: 12 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 12 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="bg-frame border border-ash rounded-xl p-7 max-w-sm w-full shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-6">
                  <h3 className="font-cinema text-lg font-medium text-ink mb-2">Leave recommendations?</h3>
                  <p className="text-sm text-fog leading-relaxed">
                    You'll need to go through the selection process again if you leave now.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={cancelLeaveNavigation}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-fog border border-ash rounded hover:border-fog hover:text-ink transition-colors"
                  >
                    Stay here
                  </button>
                  <button
                    type="button"
                    onClick={confirmLeaveNavigation}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-paper bg-ink rounded hover:bg-reel transition-colors"
                  >
                    Leave
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </ToastProvider>
    </Router>
  );
}

export default App;
