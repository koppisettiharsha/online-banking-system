import React, { useState } from 'react';
import { ArrowUpRight, Search, Filter, Download, CheckCircle2 } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'transfer' | 'deposit' | 'withdrawal';
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  receiver: {
    name: string;
    accountNumber: string;
  };
}

const demoTransactions: Transaction[] = [
  {
    id: '1',
    type: 'transfer',
    amount: 500.00,
    date: '2025-03-15',
    status: 'completed',
    receiver: {
      name: 'Johnny',
      accountNumber: '**** 4321'
    }
  },
  {
    id: '2',
    type: 'transfer',
    amount: 750.50,
    date: '2025-03-14',
    status: 'completed',
    receiver: {
      name: 'Sarah Johnson',
      accountNumber: '**** 8765'
    }
  },
  {
    id: '3',
    type: 'transfer',
    amount: 1200.00,
    date: '2025-03-13',
    status: 'pending',
    receiver: {
      name: 'harsha',
      accountNumber: '**** 9012'
    }
  }
];

const demoReceivers = [
  { name: 'Johnny', accountNumber: '**** 4321' },
  { name: 'Sarah Johnson', accountNumber: '**** 8765' },
  { name: 'harsha', accountNumber: '**** 9012' },
  { name: 'nani', accountNumber: '**** 3456' },
  { name: 'arjun', accountNumber: '**** 7890' }
];

export function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(demoTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceiver, setSelectedReceiver] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSendMoney = () => {
    if (!selectedReceiver || !amount || parseFloat(amount) <= 0) {
      return;
    }

    const receiver = demoReceivers.find(r => r.accountNumber === selectedReceiver);
    if (!receiver) return;

    const newTransaction: Transaction = {
      id: (transactions.length + 1).toString(),
      type: 'transfer',
      amount: parseFloat(amount),
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      receiver: {
        name: receiver.name,
        accountNumber: receiver.accountNumber
      }
    };

    setTransactions([newTransaction, ...transactions]);
    setAmount('');
    setSelectedReceiver('');
    
    // Show success message
    setSuccessMessage(`Successfully sent $${parseFloat(amount).toLocaleString()} to ${receiver.name}`);
    setShowSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const filteredTransactions = transactions.filter(transaction => 
    transaction.receiver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.receiver.accountNumber.includes(searchQuery)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <p className="text-gray-600">View and manage your transaction history</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Quick Transfer Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Transfer</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Receiver
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedReceiver}
                  onChange={(e) => setSelectedReceiver(e.target.value)}
                >
                  <option value="">Select a receiver</option>
                  {demoReceivers.map((receiver, index) => (
                    <option key={index} value={receiver.accountNumber}>
                      {receiver.name} - {receiver.accountNumber}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
              <button 
                className={`w-full py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  !selectedReceiver || !amount || parseFloat(amount) <= 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                onClick={handleSendMoney}
                disabled={!selectedReceiver || !amount || parseFloat(amount) <= 0}
              >
                <ArrowUpRight className="h-5 w-5" />
                Send Money
              </button>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm">
            {/* Search and Filter Bar */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  <Filter className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  <Download className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Receiver
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900">{transaction.receiver.name}</div>
                          <div className="text-sm text-gray-500">{transaction.receiver.accountNumber}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${transaction.amount.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 