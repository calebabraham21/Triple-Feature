import { motion } from 'framer-motion';
import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ConfirmSuccessPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen cinema-gradient flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full bg-cinema-dark rounded-2xl border border-cinema-light/30 p-8 text-center shadow-2xl"
      >
        {/* Success Icon */}
        <div className="relative mb-6">
          <CheckCircle size={80} className="mx-auto text-green-400" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="absolute -top-2 -right-2"
          >
            <Sparkles size={24} className="text-yellow-400" />
          </motion.div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-white mb-4">
          Welcome to Triple Feature! 🎬
        </h1>
        
        <p className="text-white/90 text-lg mb-6 leading-relaxed">
          Your email has been confirmed and your account is now active. 
          You're all set to start discovering your next favorite movies!
        </p>

        {/* Features Preview */}
        <div className="bg-white/5 rounded-lg p-4 mb-8 border border-white/10">
          <h3 className="text-white font-semibold mb-3">What's Next?</h3>
          <ul className="text-white/80 text-sm space-y-2 text-left">
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              Get personalized movie recommendations
            </li>
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              Build your watchlist
            </li>
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              Discover hidden gems
            </li>
          </ul>
        </div>

        {/* Get Started Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGetStarted}
          className="w-full bg-accent-blue hover:bg-accent-blue/80 text-white font-semibold py-4 px-6 rounded-lg transition-colors shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
        >
          <span>Start Discovering Movies</span>
          <ArrowRight size={20} />
        </motion.button>

        {/* Additional Info */}
        <p className="text-white/60 text-sm mt-6">
          You can now sign in with your email and password from any device.
        </p>
      </motion.div>
    </div>
  );
};

export default ConfirmSuccessPage;
