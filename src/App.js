import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AssetDetail from './pages/AssetDetail';
import Wallet from './pages/Wallet';
import NotFound from './pages/NotFound';
import './styles/App.css';

function App() {
  return (
    <ThemeProvider>
      <WalletProvider>
        <Router>
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/asset/:id" element={<AssetDetail />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </WalletProvider>
    </ThemeProvider>
  );
}

export default App;