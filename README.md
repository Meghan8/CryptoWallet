# CryptoWallet

A comprehensive cryptocurrency tracking application that allows users to monitor asset prices, view detailed information, and manage a personal crypto portfolio.

### Development Note

In the interest of transparency, I leveraged ChatGPT to assist with some of the CSS styling and boilerplate code patterns. The core application logic, component architecture, and feature implementation were designed and coded by me. Using AI tools allowed me to focus more on the application's functionality and user experience within the given time constraints.

## Features

- **Asset Browsing**: View a comprehensive list of cryptocurrency assets with real-time prices, market cap, volume, and 24h price changes
- **Search & Filter**: Easily find specific assets using the search functionality
- **Asset Details**: View in-depth information about each asset, including:
  - Current pricing data
  - Historical price charts with multiple timeframes (1H, 1D, 1W, 1M)
  - Market statistics (market cap, volume, supply)
- **Personal Wallet Management**:
  - Add and remove assets in your portfolio
  - Track the total value of your holdings in USD
  - View portfolio distribution with an interactive pie chart
  - Persist wallet data between sessions using local storage
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark Mode Support**: Toggle between light and dark themes

## Technologies Used

- React (Create React App)
- React Router for navigation
- Context API for state management
- Chart.js for data visualization
- CoinCap API for real-time cryptocurrency data
- Local Storage for data persistence
- Jest for testing

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/Meghan8/CryptoWallet.git
   cd CryptoWallet
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

To build the application for production:

```
npm run build
```

### Running Tests

To run the test suite:

```
npm test
```

## Project Structure

```
CryptoWallet/
├── public/                # Static files
├── src/
│   ├── api/               # API services
│   ├── components/        # Reusable UI components
│   ├── contexts/          # React Context providers
│   ├── pages/             # Page components
│   ├── styles/            # CSS styles
│   ├── App.js             # Main application component
│   └── index.js           # Application entry point
└── package.json           # Dependencies and scripts
```

## API Usage

This application uses the [CoinCap API](https://docs.coincap.io/) to fetch cryptocurrency data. The main endpoints used are:

- `/assets` - Get a list of all assets
- `/assets/{id}` - Get information about a specific asset
- `/assets/{id}/history` - Get price history for an asset

## Project Note

I was excited to work on this project and put in considerable effort to complete it within the 3-day timeframe. Due to these time constraints, there might be some minor bugs or areas for improvement that I'd love to discuss during our interview. I focused on delivering a clean, functional application with all the required features while maintaining good code organization and user experience. Given more time, I would have expanded test coverage and implemented some of the enhancement ideas listed below.

## Future Enhancements

- User authentication with cloud storage for portfolio data
- Price alerts and notifications
- Portfolio performance tracking over time
- Transaction history with purchase prices
- Support for multiple fiat currencies
- News integration for each asset
- Advanced filtering and sorting options