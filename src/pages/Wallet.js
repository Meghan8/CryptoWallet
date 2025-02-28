import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { WalletContext } from '../contexts/WalletContext';
import { fetchAssetById } from '../api/coincap';
import WalletChart from '../components/WalletChart';
import WalletAssetsList from '../components/WalletAssetsList';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Wallet.css';

const Wallet = () => {
  // Use wallet from context
  const { wallet } = useContext(WalletContext);
  const [loading, setLoading] = useState(true);
  const [walletData, setWalletData] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Debug wallet contents
  console.log("Wallet contents:", wallet);
  console.log("Wallet keys:", Object.keys(wallet));

  // Update prices and process wallet data
  const fetchLatestPrices = useCallback(async () => {
    console.log("Fetching latest prices for wallet assets...");
    setLoading(true);
    
    try {
      // Convert wallet object to array with proper validation
      const walletAssets = Object.values(wallet).filter(asset => 
        asset && asset.id && asset.symbol && asset.name && asset.amount
      );
      
      console.log("Wallet assets array:", walletAssets);
      
      // If wallet is empty, stop here
      if (walletAssets.length === 0) {
        console.log("Wallet is empty or contains invalid assets");
        setWalletData([]);
        setTotalValue(0);
        setLoading(false);
        return;
      }
      
      console.log(`Fetching prices for ${walletAssets.length} assets...`);
      
      // Fetch latest prices for each asset
      const updatedAssets = await Promise.all(
        walletAssets.map(async (asset) => {
          try {
            const result = await fetchAssetById(asset.id);
            const latestPrice = result.data.priceUsd;
            console.log(`Updated price for ${asset.id} (${asset.symbol}): $${latestPrice}`);
            
            const assetValue = asset.amount * parseFloat(latestPrice);
            console.log(`Asset value for ${asset.symbol}: $${assetValue}`);
            
            return {
              ...asset,
              priceUsd: latestPrice,
              value: assetValue,
              // Ensure all required properties exist
              id: asset.id,
              symbol: asset.symbol,
              name: asset.name,
              amount: parseFloat(asset.amount)
            };
          } catch (error) {
            console.error(`Error updating price for ${asset.id}:`, error);
            // Return asset with current price if error
            const assetValue = asset.amount * parseFloat(asset.priceUsd);
            return {
              ...asset,
              value: assetValue,
              // Ensure all required properties exist
              id: asset.id,
              symbol: asset.symbol,
              name: asset.name,
              amount: parseFloat(asset.amount)
            };
          }
        })
      );
      
      console.log("Updated assets with prices:", updatedAssets);
      
      // Sort by value (highest first)
      const sortedAssets = [...updatedAssets].sort((a, b) => 
        (parseFloat(b.value) || 0) - (parseFloat(a.value) || 0)
      );
      
      console.log("Sorted assets:", sortedAssets);
      
      // Calculate total directly from updated assets
      const calculatedTotal = updatedAssets.reduce(
        (total, asset) => total + (parseFloat(asset.value) || 0), 0
      );
      
      console.log("Calculated total value:", calculatedTotal);
      
      setWalletData(sortedAssets);
      setTotalValue(calculatedTotal);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error updating wallet prices:', error);
    } finally {
      setLoading(false);
    }
  }, [wallet]);

  // Effect for initial fetch and setting up polling
  useEffect(() => {
    console.log("Wallet component mounted or wallet changed");
    
    // Initial fetch
    fetchLatestPrices();
    
    // Set up polling at a reasonable interval (5 minutes)
    const intervalId = setInterval(() => {
      console.log("Polling for updated prices");
      fetchLatestPrices();
    }, 300000);
    
    // Clean up interval on component unmount
    return () => {
      console.log("Cleaning up price update interval");
      clearInterval(intervalId);
    };
  }, [fetchLatestPrices]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  // Always show the container, but conditionally show loading within
  return (
    <div className="wallet-container">
      <div className="wallet-header">
        <h1>My Crypto Wallet</h1>
        <h2 className="wallet-total">{formatCurrency(totalValue)}</h2>
        <p className="last-updated">Last updated: {lastUpdated.toLocaleTimeString()}</p>
        {loading && <p className="updating-message">Updating prices...</p>}
      </div>

      {/* Check both walletData and original wallet object */}
      {walletData.length === 0 && Object.keys(wallet).length === 0 ? (
        <div className="empty-wallet">
          <h3>Your wallet is empty</h3>
          <p>Add some assets to get started</p>
          <Link to="/" className="browse-assets-button">Browse Assets</Link>
        </div>
      ) : (
        <>
          <div className="wallet-chart-container">
            <WalletChart walletData={walletData} />
          </div>

          <div className="wallet-assets">
            <h3>Your Assets</h3>
            <WalletAssetsList assets={walletData} />
          </div>
        </>
      )}
    </div>
  );
};

export default Wallet;