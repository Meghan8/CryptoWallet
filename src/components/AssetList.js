import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { WalletContext } from '../contexts/WalletContext';
import '../styles/AssetList.css';

const AssetList = ({ assets, sortConfig, onSort }) => {
  const { wallet } = useContext(WalletContext);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatLargeNumber = (value) => {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short'
    }).format(value);
  };

  const formatPercent = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value / 100);
  };

  // Get the sort direction indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
    }
    return '';
  };

  return (
    <div className="asset-list-container">
      <table className="asset-table">
        <thead>
          <tr>
            <th onClick={() => onSort('rank')}>
              Rank{getSortIndicator('rank')}
            </th>
            <th onClick={() => onSort('name')}>
              Name{getSortIndicator('name')}
            </th>
            <th onClick={() => onSort('priceUsd')}>
              Price{getSortIndicator('priceUsd')}
            </th>
            <th onClick={() => onSort('changePercent24Hr')}>
              24h Change{getSortIndicator('changePercent24Hr')}
            </th>
            <th onClick={() => onSort('marketCapUsd')}>
              Market Cap{getSortIndicator('marketCapUsd')}
            </th>
            <th onClick={() => onSort('volumeUsd24Hr')}>
              Volume (24h){getSortIndicator('volumeUsd24Hr')}
            </th>
            <th>In Wallet</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={asset.id}>
              <td>{asset.rank}</td>
              <td className="asset-name-cell">
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
              <td>{formatCurrency(parseFloat(asset.priceUsd))}</td>
              <td className={parseFloat(asset.changePercent24Hr) >= 0 ? "positive-change" : "negative-change"}>
                {formatPercent(parseFloat(asset.changePercent24Hr))}
              </td>
              <td>{formatLargeNumber(parseFloat(asset.marketCapUsd))}</td>
              <td>{formatLargeNumber(parseFloat(asset.volumeUsd24Hr))}</td>
              <td className="wallet-cell">
                {wallet[asset.id] ? (
                  <span className="wallet-amount">
                    {wallet[asset.id].amount} {asset.symbol}
                  </span>
                ) : (
                  <span className="not-in-wallet">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssetList;