import { useState } from 'react';
import { WatchlistProvider } from './context/WatchlistContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import WatchlistPage from './pages/WatchlistPage';
import AboutMe from './pages/AboutMe';
import AboutTripleFeature from './pages/AboutTripleFeature';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'watchlist':
        return <WatchlistPage />;
      case 'about-me':
        return <AboutMe />;
      case 'about-triple':
        return <AboutTripleFeature />;
      default:
        return <HomePage />;
    }
  };

  return (
    <WatchlistProvider>
      <div className="min-h-screen">
        <Header currentPage={currentPage} onNavigate={handleNavigate} />
        <main>
          {renderPage()}
        </main>
      </div>
    </WatchlistProvider>
  );
}

export default App;
