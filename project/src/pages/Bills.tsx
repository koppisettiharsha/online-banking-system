import React, { useState } from 'react';
import { Calendar, CreditCard, Clock, CheckCircle2, AlertCircle, X } from 'lucide-react';

interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  category: 'utilities' | 'subscription' | 'rent' | 'other';
  recurring: boolean;
  lastPaid?: string;
}

const demoBills: Bill[] = [
  {
    id: '1',
    name: 'Electricity Bill',
    amount: 85.50,
    dueDate: '2025-05-25',
    status: 'pending',
    category: 'utilities',
    recurring: true,
    lastPaid: '2025-04-25'
  },
  {
    id: '2',
    name: 'Netflix Subscription',
    amount: 15.99,
    dueDate: '2025-05-20',
    status: 'pending',
    category: 'subscription',
    recurring: true,
    lastPaid: '2025-04-20'
  },
  {
    id: '3',
    name: 'Rent Payment',
    amount: 1200.00,
    dueDate: '2025-05-01',
    status: 'paid',
    category: 'rent',
    recurring: true,
    lastPaid: '2025-04-01'
  },
  {
    id: '4',
    name: 'Water Bill',
    amount: 45.75,
    dueDate: '2025-05-05',
    status: 'overdue',
    category: 'utilities',
    recurring: true,
    lastPaid: '2025-04-15'
  },
  {
    id: '5',
    name: 'Internet Service',
    amount: 59.99,
    dueDate: '2025-05-28',
    status: 'pending',
    category: 'utilities',
    recurring: true,
    lastPaid: '2025-04-28'
  }
];

export function Bills() {
  const [bills, setBills] = useState<Bill[]>(demoBills);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [passwordError, setPasswordError] = useState('');

  const handlePayBill = (bill: Bill) => {
    setSelectedBill(bill);
    setShowPasswordModal(true);
    setPassword('');
    setPasswordError('');
  };

  const confirmPayment = () => {
    // Demo password is "1234"
    if (password === '1234') {
      const updatedBills = bills.map(b => {
        if (b.id === selectedBill?.id) {
          return {
            ...b,
            status: 'paid' as const,
            lastPaid: new Date().toISOString().split('T')[0]
          };
        }
        return b;
      });

      setBills(updatedBills);
      setSuccessMessage(`Successfully paid $${selectedBill?.amount.toLocaleString()} for ${selectedBill?.name}`);
      setShowSuccess(true);
      setShowPasswordModal(false);
      setSelectedBill(null);
      setPassword('');

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } else {
      setPasswordError('Incorrect password. Please try again.');
    }
  };

  const getStatusColor = (status: Bill['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
    }
  };

  const getCategoryIcon = (category: Bill['category']) => {
    switch (category) {
      case 'utilities':
        return <CreditCard className="h-5 w-5" />;
      case 'subscription':
        return <Clock className="h-5 w-5" />;
      case 'rent':
        return <Calendar className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Password Confirmation Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Confirm Payment</h3>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setSelectedBill(null);
                  setPassword('');
                  setPasswordError('');
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Please enter your password to confirm payment of{' '}
                <span className="font-semibold">
                  ${selectedBill?.amount.toLocaleString()}
                </span>{' '}
                for {selectedBill?.name}
              </p>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError('');
                }}
                placeholder="Enter your password"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {passwordError && (
                <p className="mt-2 text-sm text-red-600">{passwordError}</p>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setSelectedBill(null);
                  setPassword('');
                  setPasswordError('');
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmPayment}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Bills & Payments</h1>
        <p className="text-gray-600">Manage your recurring bills and payments</p>
      </div>

      {/* Bills Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Total Due</h3>
            <AlertCircle className="h-5 w-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ${bills
              .filter(bill => bill.status !== 'paid')
              .reduce((sum, bill) => sum + bill.amount, 0)
              .toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {bills.filter(bill => bill.status !== 'paid').length} bills pending
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Overdue</h3>
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ${bills
              .filter(bill => bill.status === 'overdue')
              .reduce((sum, bill) => sum + bill.amount, 0)
              .toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {bills.filter(bill => bill.status === 'overdue').length} bills overdue
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Paid This Month</h3>
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ${bills
              .filter(bill => bill.status === 'paid' && 
                new Date(bill.lastPaid!).getMonth() === new Date().getMonth())
              .reduce((sum, bill) => sum + bill.amount, 0)
              .toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {bills.filter(bill => bill.status === 'paid' && 
              new Date(bill.lastPaid!).getMonth() === new Date().getMonth()).length} bills paid
          </p>
        </div>
      </div>

      {/* Bills List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Bills</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {bills.map((bill) => (
            <div key={bill.id} className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {getCategoryIcon(bill.category)}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{bill.name}</h3>
                  <p className="text-sm text-gray-500">
                    Due {new Date(bill.dueDate).toLocaleDateString()}
                    {bill.recurring && ' • Recurring'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    ${bill.amount.toLocaleString()}
                  </p>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(bill.status)}`}>
                    {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                  </span>
                </div>
                {bill.status !== 'paid' && (
                  <button
                    onClick={() => handlePayBill(bill)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 