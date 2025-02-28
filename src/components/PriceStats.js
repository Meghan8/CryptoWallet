import React from 'react';
import '../styles/PriceStats.css';

const PriceStats = ({ asset }) => {
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

  return (
    <div className="price-stats">
      <h3>Market Stats</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">Market Cap</span>
          <span className="stat-value">{formatCurrency(parseFloat(asset.marketCapUsd))}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Volume (24h)</span>
          <span className="stat-value">{formatCurrency(parseFloat(asset.volumeUsd24Hr))}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">24h Change</span>
          <span className={`stat-value ${parseFloat(asset.changePercent24Hr) >= 0 ? "positive-change" : "negative-change"}`}>
            {formatPercent(parseFloat(asset.changePercent24Hr))}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Supply</span>
          <span className="stat-value">{formatLargeNumber(parseFloat(asset.supply))} {asset.symbol}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Max Supply</span>
          <span className="stat-value">
            {asset.maxSupply ? `${formatLargeNumber(parseFloat(asset.maxSupply))} ${asset.symbol}` : 'Unlimited'}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Circulating</span>
          <span className="stat-value">
            {asset.maxSupply ? formatPercent(parseFloat(asset.supply) / parseFloat(asset.maxSupply)) : '—'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PriceStats;