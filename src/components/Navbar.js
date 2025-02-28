import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WalletContext } from '../contexts/WalletContext';
import { ThemeContext } from '../contexts/ThemeContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const { getTotalValue } = useContext(WalletContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <img src={`${process.env.PUBLIC_URL}/logo.svg`} alt="CryptoTracker" className="logo" />
            <span>CryptoTracker</span>
          </Link>
        </div>

        <div className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'active' : ''}
            onClick={() => setMobileMenuOpen(false)}
          >
            Assets
          </Link>
          <Link 
            to="/wallet" 
            className={location.pathname === '/wallet' ? 'active' : ''}
            onClick={() => setMobileMenuOpen(false)}
          >
            Wallet <span className="wallet-value">{formatCurrency(getTotalValue())}</span>
          </Link>
        </div>

        <div className="navbar-actions">
          <button onClick={toggleTheme} className="theme-toggle">
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button className="mobile-menu-button" onClick={toggleMobileMenu}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;