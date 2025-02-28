import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WalletContext } from '../contexts/WalletContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { fetchAssetById } from '../api/coincap';
import '../styles/Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const { wallet } = useContext(WalletContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletTotal, setWalletTotal] = useState(0);

  // Calculate total wallet value with fresh prices
  useEffect(() => {
    const calculateWalletValue = async () => {
      try {
        // If wallet is empty, total is 0
        if (Object.keys(wallet).length === 0) {
          setWalletTotal(0);
          return;
        }
        
        // Calculate total with the latest prices
        let total = 0;
        
        // For efficiency, only update prices every 5 minutes unless on the wallet page
        const lastUpdate = localStorage.getItem('lastPriceUpdate');
        const now = Date.now();
        const fiveMinutes = 5 * 60 * 1000;
        
        // If we've updated prices recently, use stored values
        if (lastUpdate && now - parseInt(lastUpdate) < fiveMinutes && location.pathname !== '/wallet') {
          // Use stored total if available
          const storedTotal = localStorage.getItem('walletTotalValue');
          if (storedTotal) {
            setWalletTotal(parseFloat(storedTotal));
            return;
          }
          
          // Otherwise just calculate from current wallet data
          total = Object.values(wallet).reduce((sum, asset) => {
            return sum + (parseFloat(asset.amount) * parseFloat(asset.priceUsd));
          }, 0);
        } else {
          // Fetch latest prices and calculate total
          for (const assetId in wallet) {
            try {
              const result = await fetchAssetById(assetId);
              const latestPrice = parseFloat(result.data.priceUsd);
              const amount = parseFloat(wallet[assetId].amount);
              total += amount * latestPrice;
            } catch (error) {
              // If fetch fails, use stored price
              total += parseFloat(wallet[assetId].amount) * parseFloat(wallet[assetId].priceUsd);
            }
          }
          
          // Store the update time and total
          localStorage.setItem('lastPriceUpdate', now.toString());
          localStorage.setItem('walletTotalValue', total.toString());
        }
        
        setWalletTotal(total);
      } catch (error) {
        console.error('Error calculating wallet value:', error);
      }
    };
    
    calculateWalletValue();
  }, [wallet, location.pathname]);

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
            Wallet <span className="wallet-value">{formatCurrency(walletTotal)}</span>
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