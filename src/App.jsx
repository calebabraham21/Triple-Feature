import { useState } from 'react';
import { WatchlistProvider } from './context/WatchlistContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import WatchlistPage from './pages/WatchlistPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'watchlist':
        return <WatchlistPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <WatchlistProvider>
      <div className="min-h-screen bg-cinema-black">
        <Header currentPage={currentPage} onNavigate={handleNavigate} />
        <main>
          {renderPage()}
        </main>
      </div>
    </WatchlistProvider>
  );
}

export default App;
