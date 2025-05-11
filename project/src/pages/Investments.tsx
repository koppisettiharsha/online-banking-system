import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart2, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';

interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  shares: number;
  value: number;
}

interface Portfolio {
  id: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  stocks: Stock[];
}

const demoPortfolios: Portfolio[] = [
  {
    id: '1',
    name: 'Tech Growth',
    value: 25420.75,
    change: 1250.50,
    changePercent: 5.18,
    stocks: [
      {
        id: '1',
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 175.50,
        change: 2.50,
        changePercent: 1.45,
        shares: 50,
        value: 8775.00
      },
      {
        id: '2',
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        price: 415.32,
        change: -3.25,
        changePercent: -0.78,
        shares: 20,
        value: 8306.40
      },
      {
        id: '3',
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        price: 142.65,
        change: 1.85,
        changePercent: 1.31,
        shares: 30,
        value: 4279.50
      }
    ]
  },
  {
    id: '2',
    name: 'Dividend Income',
    value: 18750.25,
    change: -320.75,
    changePercent: -1.68,
    stocks: [
      {
        id: '4',
        symbol: 'JNJ',
        name: 'Johnson & Johnson',
        price: 158.75,
        change: -1.25,
        changePercent: -0.78,
        shares: 40,
        value: 6350.00
      },
      {
        id: '5',
        symbol: 'PG',
        name: 'Procter & Gamble',
        price: 145.80,
        change: 0.80,
        changePercent: 0.55,
        shares: 35,
        value: 5103.00
      },
      {
        id: '6',
        symbol: 'KO',
        name: 'Coca-Cola Company',
        price: 60.25,
        change: -0.45,
        changePercent: -0.74,
        shares: 50,
        value: 3012.50
      }
    ]
  }
];

export function Investments() {
  const [portfolios] = useState<Portfolio[]>(demoPortfolios);
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>(demoPortfolios[0].id);

  const totalValue = portfolios.reduce((sum, portfolio) => sum + portfolio.value, 0);
  const totalChange = portfolios.reduce((sum, portfolio) => sum + portfolio.change, 0);
  const totalChangePercent = (totalChange / (totalValue - totalChange)) * 100;

  const currentPortfolio = portfolios.find(p => p.id === selectedPortfolio);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Investments</h1>
        <p className="text-gray-600">Manage your investment portfolios and track performance</p>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Total Value</h3>
            <DollarSign className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ${totalValue.toLocaleString()}
          </p>
          <div className="flex items-center mt-2">
            {totalChange >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${
              totalChange >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {totalChange >= 0 ? '+' : ''}{totalChange.toLocaleString()} ({totalChangePercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Portfolios</h3>
            <PieChart className="h-5 w-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {portfolios.length}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Active investment portfolios
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Total Stocks</h3>
            <BarChart2 className="h-5 w-5 text-indigo-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {portfolios.reduce((sum, p) => sum + p.stocks.length, 0)}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Stocks across all portfolios
          </p>
        </div>
      </div>

      {/* Portfolio Selection */}
      <div className="mb-6">
        <div className="flex space-x-4">
          {portfolios.map(portfolio => (
            <button
              key={portfolio.id}
              onClick={() => setSelectedPortfolio(portfolio.id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedPortfolio === portfolio.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {portfolio.name}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Portfolio Details */}
      {currentPortfolio && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{currentPortfolio.name}</h2>
                <p className="text-sm text-gray-500">
                  {currentPortfolio.stocks.length} stocks in portfolio
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  ${currentPortfolio.value.toLocaleString()}
                </p>
                <div className="flex items-center justify-end">
                  {currentPortfolio.change >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    currentPortfolio.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {currentPortfolio.change >= 0 ? '+' : ''}{currentPortfolio.change.toLocaleString()} ({currentPortfolio.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stocks Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shares
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Change
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentPortfolio.stocks.map((stock) => (
                  <tr key={stock.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">{stock.symbol}</div>
                        <div className="text-sm text-gray-500">{stock.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{stock.shares}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${stock.price.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${stock.value.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {stock.change >= 0 ? (
                          <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span className={`text-sm font-medium ${
                          stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 