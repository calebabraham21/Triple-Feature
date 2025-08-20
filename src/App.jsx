import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, CheckCircle, Sparkles, AlertTriangle } from 'lucide-react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import WatchlistPage from './pages/WatchlistPage';
import AboutMe from './pages/AboutMe';
import AboutTripleFeature from './pages/AboutTripleFeature';
import EditorsChoicePage from './pages/EditorsChoicePage';
import AuthPage from './pages/AuthPage';
import ConfirmSuccessPage from './pages/ConfirmSuccessPage';
import Footer from './components/Footer';
import { useAuth } from './hooks/useAuth';
import { supabase } from './lib/supabaseClient';

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
  const [currentStep, setCurrentStep] = useState(1);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [showEmailConfirmSuccess, setShowEmailConfirmSuccess] = useState(false);
  const [showLeaveRecommendationsConfirm, setShowLeaveRecommendationsConfirm] = useState(false);
  const [pendingNavigationPath, setPendingNavigationPath] = useState(null);
  const [pendingOnConfirm, setPendingOnConfirm] = useState(null);
  const { signOut } = useAuth();

  // Handle email confirmation success
  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Only show popup if user just confirmed their email (not on regular sign-ins)
      if (session?.user) {
        const emailConfirmedAt = session.user.email_confirmed_at;
        const lastSignInAt = session.user.last_sign_in_at;
        
        if (emailConfirmedAt && lastSignInAt) {
          // Check if confirmation and sign-in happened very recently (within 2 minutes)
          // This indicates they just confirmed their email and signed in
          const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
          const emailConfirmedTime = new Date(emailConfirmedAt);
          const lastSignInTime = new Date(lastSignInAt);
          
          if (emailConfirmedTime > twoMinutesAgo && lastSignInTime > twoMinutesAgo) {
            // Only show if this is the first time we're detecting this confirmation
            const confirmationKey = `email_confirmed_${session.user.id}_${emailConfirmedAt}`;
            if (!localStorage.getItem(confirmationKey)) {
              localStorage.setItem(confirmationKey, 'true');
              setShowEmailConfirmSuccess(true);
            }
          }
        }
      }
    };

    // Check on mount
    handleEmailConfirmation();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
        // Only show for new email confirmations, not regular sign-ins
        const emailConfirmedAt = session.user.email_confirmed_at;
        const lastSignInAt = session.user.last_sign_in_at;
        
        if (emailConfirmedAt && lastSignInAt) {
          const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
          const emailConfirmedTime = new Date(emailConfirmedAt);
          const lastSignInTime = new Date(lastSignInAt);
          
          if (emailConfirmedTime > twoMinutesAgo && lastSignInTime > twoMinutesAgo) {
            const confirmationKey = `email_confirmed_${session.user.id}_${emailConfirmedAt}`;
            if (!localStorage.getItem(confirmationKey)) {
              localStorage.setItem(confirmationKey, 'true');
              setShowEmailConfirmSuccess(true);
            }
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Update current page based on current route
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/') setCurrentPage('home');
    else if (path === '/editors-choice') setCurrentPage('editors-choice');
    else if (path === '/about-me') setCurrentPage('about-me');
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

  const handleStepChange = (step) => {
    setCurrentStep(step);
  };

  const handleProtectedNavigation = (path) => {
    // Show confirmation only when leaving recommendations (step 5)
    if (currentStep === 5) {
      setPendingNavigationPath(path);
      setPendingOnConfirm(null);
      setShowLeaveRecommendationsConfirm(true);
    } else {
      window.location.href = path;
    }
  };

  // Generic protected action (e.g., Start Over) that should confirm when on step 5
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
        <Header 
          currentPage={currentPage} 
          currentStep={currentStep}
          onNavigate={handleNavigate} 
          onSignOutRequest={handleSignOutRequest}
          onHomeNavigation={() => handleProtectedNavigation('/')}
          onProtectedNavRequest={handleProtectedNavigation}
        />
        <div className="app-gradient">
          <main>
            <Routes>
              <Route path="/" element={<HomePage onStepChange={handleStepChange} onProtectedActionRequest={handleProtectedAction} />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/confirm-success" element={<ConfirmSuccessPage />} />
              <Route path="/watchlist" element={<ProtectedRoute><WatchlistPage /></ProtectedRoute>} />
              <Route path="/about-me" element={<AboutMe />} />
              <Route path="/about-triple" element={<AboutTripleFeature />} />
              <Route path="/editors-choice" element={<EditorsChoicePage />} />
              {/* Redirects for old routes */}
              <Route path="/projects" element={<Navigate to="/about-me#projects" replace />} />
              <Route path="/contact" element={<Navigate to="/about-me#contact" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />
        </div>

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

        {/* Email Confirmation Success Popup */}
        <AnimatePresence>
          {showEmailConfirmSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-cinema-dark border border-cinema-light/30 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center"
              >
                {/* Success Icon */}
                <div className="relative mb-6">
                  <CheckCircle size={80} className="mx-auto text-green-400" />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="absolute -top-2 -right-2"
                  >
                    <Sparkles size={24} className="text-yellow-400" />
                  </motion.div>
                </div>

                {/* Success Message */}
                <h2 className="text-2xl font-bold text-white mb-4">
                  Welcome to Triple Feature! 🎬
                </h2>
                
                <p className="text-white/90 text-lg mb-6 leading-relaxed">
                  Your email has been confirmed and your account is now active. 
                  You're all set to start discovering your next favorite movies!
                </p>

                {/* Get Started Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowEmailConfirmSuccess(false)}
                  className="w-full bg-accent-blue hover:bg-accent-blue/80 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-lg hover:shadow-xl"
                >
                  Start Exploring
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Leave Recommendations Confirmation Popup */}
        <AnimatePresence>
          {showLeaveRecommendationsConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90"
              onClick={cancelLeaveNavigation}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
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
                    onClick={cancelLeaveNavigation}
                    className="flex-1 px-4 py-2 bg-cinema-gray hover:bg-cinema-light text-white rounded-lg transition-colors"
                  >
                    Stay Here
                  </button>
                  <button
                    onClick={confirmLeaveNavigation}
                    className="flex-1 px-4 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white rounded-lg transition-colors"
                  >
                    Leave Page
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
