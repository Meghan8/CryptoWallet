import React, { createContext, useState, useEffect, useCallback } from 'react';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState({});
  const [loading, setLoading] = useState(true);

  // Load wallet from localStorage on initial render
  useEffect(() => {
    const savedWallet = localStorage.getItem('cryptoWallet');
    if (savedWallet) {
      try {
        setWallet(JSON.parse(savedWallet));
      } catch (e) {
        console.error("Error parsing wallet from localStorage:", e);
        setWallet({});
      }
    }
    setLoading(false);
  }, []);

  // Save wallet to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('cryptoWallet', JSON.stringify(wallet));
      console.log("Wallet saved to localStorage:", wallet);
    }
  }, [wallet, loading]);

  // Add asset to wallet
  const addAsset = useCallback((asset, amount) => {
    console.log("Adding asset to wallet:", asset.id, amount);
    
    setWallet(prevWallet => {
      const currentAmount = prevWallet[asset.id] ? prevWallet[asset.id].amount : 0;
      const newWallet = {
        ...prevWallet,
        [asset.id]: {
          id: asset.id,
          symbol: asset.symbol,
          name: asset.name,
          amount: currentAmount + parseFloat(amount),
          priceUsd: asset.priceUsd,
          lastUpdated: new Date().toISOString()
        }
      };
      
      console.log("New wallet state:", newWallet);
      return newWallet;
    });
  }, []);

  // Remove asset from wallet
  const removeAsset = useCallback((assetId, amount) => {
    console.log("Removing asset from wallet:", assetId, amount);
    
    setWallet(prevWallet => {
      // If asset doesn't exist in wallet, do nothing
      if (!prevWallet[assetId]) return prevWallet;

      const currentAmount = prevWallet[assetId].amount;
      const newAmount = currentAmount - parseFloat(amount);

      // If removing more than owned or all, remove the asset completely
      if (newAmount <= 0) {
        const newWallet = { ...prevWallet };
        delete newWallet[assetId];
        console.log("Asset removed completely. New wallet:", newWallet);
        return newWallet;
      }

      // Otherwise reduce the amount
      const newWallet = {
        ...prevWallet,
        [assetId]: {
          ...prevWallet[assetId],
          amount: newAmount,
          lastUpdated: new Date().toISOString()
        }
      };
      
      console.log("Asset amount reduced. New wallet:", newWallet);
      return newWallet;
    });
  }, []);

  // Update asset price in wallet
  const updateAssetPrice = useCallback((assetId, priceUsd) => {
    setWallet(prevWallet => {
      if (!prevWallet[assetId]) return prevWallet;

      return {
        ...prevWallet,
        [assetId]: {
          ...prevWallet[assetId],
          priceUsd,
          lastUpdated: new Date().toISOString()
        }
      };
    });
  }, []);

  // Calculate total wallet value in USD
  const getTotalValue = useCallback(() => {
    return Object.values(wallet).reduce((total, asset) => {
      return total + (parseFloat(asset.amount) * parseFloat(asset.priceUsd));
    }, 0);
  }, [wallet]);

  return (
    <WalletContext.Provider value={{ 
      wallet, 
      addAsset, 
      removeAsset, 
      updateAssetPrice, 
      getTotalValue,
      loading 
    }}>
      {children}
    </WalletContext.Provider>
  );
};