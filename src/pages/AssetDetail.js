import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAssetById, fetchAssetHistory } from '../api/coincap';
import { WalletContext } from '../contexts/WalletContext';
import AssetChart from '../components/AssetChart';
import PriceStats from '../components/PriceStats';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/AssetDetail.css';

const AssetDetail = () => {
  const { id } = useParams();
  const { wallet, addAsset, removeAsset } = useContext(WalletContext);
  const [asset, setAsset] = useState(null);
  const [history, setHistory] = useState([]);
  const [timeframe, setTimeframe] = useState('d1'); // d1 = 1 day
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError, setChartError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  // Function to map user-friendly timeframes to API parameters
  const getIntervalParam = (timeframe) => {
    // According to CoinCap API docs:
    // Valid intervals: m1, m5, m15, m30, h1, h2, h6, h12, d1
    switch(timeframe) {
      case 'h1': return 'm5';  // 5 minute intervals for 1 hour view
      case 'd1': return 'h1';  // 1 hour intervals for 1 day view 
      case 'w1': return 'h6';  // 6 hour intervals for 1 week view
      case 'm1': return 'd1';  // 1 day intervals for 1 month view
      default: return 'h1';    // Default to 1 hour intervals
    }
  };

  // Function to get the start timestamp based on timeframe
  const getStartTime = (timeframe) => {
    const now = new Date();
    switch(timeframe) {
      case 'h1': 
        return new Date(now.getTime() - (60 * 60 * 1000)).getTime(); // 1 hour ago
      case 'd1': 
        return new Date(now.getTime() - (24 * 60 * 60 * 1000)).getTime(); // 1 day ago
      case 'w1': 
        return new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000)).getTime(); // 1 week ago
      case 'm1': 
        return new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000)).getTime(); // 30 days ago
      default: 
        return new Date(now.getTime() - (24 * 60 * 60 * 1000)).getTime(); // Default to 1 day
    }
  };

  // Load asset details
  useEffect(() => {
    const fetchAssetDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch asset details
        const assetResult = await fetchAssetById(id);
        setAsset(assetResult.data);
      } catch (err) {
        setError('Failed to load asset details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssetDetails();
  }, [id]);

  // Load history data separately
  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        setChartLoading(true);
        setChartError(null);
        
        // Convert timeframe to API parameters
        const interval = getIntervalParam(timeframe);
        const start = getStartTime(timeframe);
        const end = Date.now();
        
        console.log(`Fetching history with interval=${interval}, start=${new Date(start).toISOString()}, end=${new Date(end).toISOString()}`);
        
        // Fetch asset price history with start and end times
        const historyResult = await fetchAssetHistory(id, interval, start, end);
        
        if (historyResult.data && historyResult.data.length > 0) {
          setHistory(historyResult.data);
        } else {
          setChartError(`No data available for the selected timeframe (${timeframe})`);
          setHistory([]);
        }
      } catch (err) {
        setChartError('Failed to load price history. Please try a different timeframe.');
        console.error('History fetch error:', err);
        setHistory([]);
      } finally {
        setChartLoading(false);
      }
    };

    if (asset) {
      fetchHistoryData();
    }
  }, [id, timeframe, asset]);

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };

  const handleAddAsset = () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setActionMessage('Please enter a valid amount');
      setTimeout(() => setActionMessage(''), 3000);
      return;
    }
    
    try {
      addAsset(asset, parseFloat(amount));
      setActionMessage(`Added ${amount} ${asset.symbol} to your wallet`);
      setTimeout(() => setActionMessage(''), 3000);
      setAmount('');
    } catch (error) {
      console.error("Error adding asset to wallet:", error);
      setActionMessage('Failed to add asset to wallet');
      setTimeout(() => setActionMessage(''), 3000);
    }
  };

  const handleRemoveAsset = () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setActionMessage('Please enter a valid amount');
      setTimeout(() => setActionMessage(''), 3000);
      return;
    }
    
    try {
      removeAsset(id, parseFloat(amount));
      setActionMessage(`Removed ${amount} ${asset.symbol} from your wallet`);
      setTimeout(() => setActionMessage(''), 3000);
      setAmount('');
    } catch (error) {
      console.error("Error removing asset from wallet:", error);
      setActionMessage('Failed to remove asset from wallet');
      setTimeout(() => setActionMessage(''), 3000);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatPercent = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value / 100);
  };

  // Get user-friendly timeframe label
  const getTimeframeLabel = (tf) => {
    switch(tf) {
      case 'h1': return '1 Hour';
      case 'd1': return '1 Day';
      case 'w1': return '1 Week';
      case 'm1': return '1 Month';
      default: return tf;
    }
  };

  // Get wallet amount for this asset
  const walletAmount = wallet[id] ? wallet[id].amount : 0;

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!asset) return <ErrorMessage message="Asset not found" />;

  return (
    <div className="asset-detail-container">
      <div className="asset-header">
        <div className="asset-title">
          <img 
            src={`https://assets.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`} 
            alt={asset.symbol}
            onError={(e) => { e.target.src = `${process.env.PUBLIC_URL}/images/crypto-placeholder.png`; }}
            className="asset-icon"
          />
          <div>
            <h1>{asset.name} ({asset.symbol})</h1>
            <p className="asset-rank">Rank #{asset.rank}</p>
          </div>
        </div>
        <div className="asset-price">
          <h2>{formatCurrency(parseFloat(asset.priceUsd))}</h2>
          <p className={parseFloat(asset.changePercent24Hr) >= 0 ? "positive-change" : "negative-change"}>
            {formatPercent(parseFloat(asset.changePercent24Hr))} (24h)
          </p>
        </div>
      </div>

      <div className="asset-chart-container">
        <div className="timeframe-selector">
          <button 
            className={timeframe === 'h1' ? 'active' : ''} 
            onClick={() => handleTimeframeChange('h1')}
          >
            1H
          </button>
          <button 
            className={timeframe === 'd1' ? 'active' : ''} 
            onClick={() => handleTimeframeChange('d1')}
          >
            1D
          </button>
          <button 
            className={timeframe === 'w1' ? 'active' : ''} 
            onClick={() => handleTimeframeChange('w1')}
          >
            1W
          </button>
          <button 
            className={timeframe === 'm1' ? 'active' : ''} 
            onClick={() => handleTimeframeChange('m1')}
          >
            1M
          </button>
        </div>
        
        <div className="chart-info">
          <span className="timeframe-label">
            {getTimeframeLabel(timeframe)} Price History
          </span>
        </div>

        {chartLoading ? (
          <div className="chart-loading">
            <div className="chart-loading-spinner"></div>
            <p>Loading price history...</p>
          </div>
        ) : chartError ? (
          <div className="chart-error">
            <p>{chartError}</p>
          </div>
        ) : (
          <AssetChart history={history} timeframe={timeframe} />
        )}
      </div>

      <div className="asset-content">
        <div className="asset-stats">
          <PriceStats asset={asset} />
        </div>

        <div className="wallet-actions">
          <h3>Wallet</h3>
          <p>Current holdings: <strong>{walletAmount} {asset.symbol}</strong></p>
          <p>Value: <strong>{formatCurrency(walletAmount * parseFloat(asset.priceUsd))}</strong></p>
          
          {actionMessage && (
            <div className="action-message">
              {actionMessage}
            </div>
          )}
          
          <div className="action-form">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="0"
              step="any"
              className="amount-input"
            />
            <div className="action-buttons">
              <button onClick={handleAddAsset} className="add-button">Add to Wallet</button>
              <button 
                onClick={handleRemoveAsset} 
                className="remove-button"
                disabled={walletAmount <= 0}
              >
                Remove from Wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetail;