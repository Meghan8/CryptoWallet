import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <p>&copy; {currentYear} CryptoWallet. All rights reserved.</p>
          <p>
            Powered by <a href="https://coincap.io/" target="_blank" rel="noopener noreferrer">CoinCap API</a>
          </p>
        </div>
        <div className="footer-links">
          <a href="#" className="footer-link">Terms of Service</a>
          <a href="#" className="footer-link">Privacy Policy</a>
          <a href="#" className="footer-link">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;