const API_BASE_URL = 'https://api.coincap.io/v2';

export const fetchAssets = async (search = '', limit = 20, offset = 0) => {
  try {
    // If there's a search term, filter by it
    const searchParam = search ? `&search=${search}` : '';
    const response = await fetch(`${API_BASE_URL}/assets?limit=${limit}&offset=${offset}${searchParam}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching assets:', error);
    throw error;
  }
};

export const fetchAssetById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/assets/${id}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching asset ${id}:`, error);
    throw error;
  }
};

/**
 * Fetch price history for an asset
 * @param {string} id - Asset ID
 * @param {string} interval - Data interval ('m1', 'm5', 'm15', 'm30', 'h1', 'h2', 'h6', 'h12', 'd1')
 * @param {number} start - Start timestamp in milliseconds
 * @param {number} end - End timestamp in milliseconds
 * @returns {Promise<Object>} - Promise resolving to history data
 */
export const fetchAssetHistory = async (id, interval = 'h1', start, end) => {
  try {
    // Build URL with parameters
    let url = `${API_BASE_URL}/assets/${id}/history?interval=${interval}`;
    
    // Add start and end times if provided
    if (start) url += `&start=${start}`;
    if (end) url += `&end=${end}`;
    
    console.log('Fetching history with URL:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Retrieved ${data.data?.length || 0} data points for ${id}`);
    return data;
  } catch (error) {
    console.error(`Error fetching asset history for ${id}:`, error);
    throw error;
  }
};

/**
 * Fetch market data for an asset
 * @param {string} id - Asset ID 
 * @returns {Promise<Object>} - Promise resolving to market data
 */
export const fetchAssetMarkets = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/assets/${id}/markets`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching markets for ${id}:`, error);
    throw error;
  }
};