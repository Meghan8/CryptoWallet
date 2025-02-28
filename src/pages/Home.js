import React, { useState, useEffect, useCallback } from 'react';
import { fetchAssets } from '../api/coincap';
import AssetList from '../components/AssetList';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/Home.css';

const Home = () => {
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'rank', direction: 'asc' });
  const [page, setPage] = useState(1);
  const limit = 20;

  const loadAssets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const offset = (page - 1) * limit;
      const result = await fetchAssets(search, limit, offset);
      setAssets(result.data);
      setFilteredAssets(result.data);
    } catch (err) {
      setError('Failed to load assets. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    setFilteredAssets(prev => {
      const sortedAssets = [...prev];
      sortedAssets.sort((a, b) => {
        if (key === 'name' || key === 'symbol') {
          return direction === 'asc' 
            ? a[key].localeCompare(b[key])
            : b[key].localeCompare(a[key]);
        } else {
          return direction === 'asc' 
            ? parseFloat(a[key]) - parseFloat(b[key])
            : parseFloat(b[key]) - parseFloat(a[key]);
        }
      });
      return sortedAssets;
    });
  };

  const handleSearch = (term) => {
    setSearch(term);
    setPage(1);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    setPage(prev => prev + 1);
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Crypto Asset Tracker</h1>
        <p>Track prices, manage your portfolio, and stay updated on the crypto market</p>
      </div>

      <div className="assets-section">
        <h2>Market Overview</h2>
        <SearchBar onSearch={handleSearch} />

        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}
        
        {!loading && !error && (
          <>
            <AssetList 
              assets={filteredAssets} 
              sortConfig={sortConfig} 
              onSort={handleSort} 
            />
            
            <div className="pagination">
              <button 
                onClick={handlePrevPage} 
                disabled={page === 1}
                className="pagination-button"
              >
                Previous
              </button>
              <span className="page-indicator">Page {page}</span>
              <button 
                onClick={handleNextPage}
                className="pagination-button"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;