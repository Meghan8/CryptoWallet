import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/WalletAssetsList.css';

const WalletAssetsList = ({ assets }) => {
  console.log("WalletAssetsList rendering with assets:", assets);
  
  // Filter out any invalid assets and ensure all have proper values
  const validAssets = assets.filter(asset => 
    asset && asset.id && asset.symbol && asset.name && typeof asset.amount === 'number'
  );
  
  console.log("Valid assets for list:", validAssets);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  if (validAssets.length === 0) {
    return (
      <div className="wallet-assets-list">
        <div className="no-assets-message">
          No assets found in your wallet. Add some assets to see them listed here.
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-assets-list">
      <table className="wallet-table">
        <thead>
          <tr>
            <th>Asset</th>
            <th>Amount</th>
            <th>Price</th>
            <th>Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {validAssets.map((asset) => (
            <tr key={asset.id}>
              <td className="asset-cell">
                <Link to={`/asset/${asset.id}`} className="asset-link">
                  <img 
                    src={`https://assets.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`} 
                    alt={asset.symbol}
                    onError={(e) => { e.target.src = `${process.env.PUBLIC_URL}/images/crypto-placeholder.png`; }}
                    className="asset-icon-small"
                  />
                  <div>
                    <span className="asset-name">{asset.name}</span>
                    <span className="asset-symbol">{asset.symbol}</span>
                  </div>
                </Link>
              </td>
              <td className="amount-cell">{asset.amount}</td>
              <td>{formatCurrency(parseFloat(asset.priceUsd) || 0)}</td>
              <td className="value-cell">{formatCurrency(parseFloat(asset.value) || 0)}</td>
              <td className="actions-cell">
                <Link to={`/asset/${asset.id}`} className="manage-button">
                  Manage
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WalletAssetsList;