import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import WatchlistPage from './pages/WatchlistPage';
import AboutMe from './pages/AboutMe';
import AboutTripleFeature from './pages/AboutTripleFeature';
import AuthPage from './pages/AuthPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  return (
    <Router>
      <div className="min-h-screen">
        <Header currentPage={currentPage} onNavigate={handleNavigate} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/about-me" element={<AboutMe />} />
            <Route path="/about-triple" element={<AboutTripleFeature />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
