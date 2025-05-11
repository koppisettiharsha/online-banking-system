import React, { useState } from 'react';
import { CreditCard, ArrowUpRight, ArrowDownRight, PieChart, Activity, AlertTriangle, Receipt, Wallet, X, User, Search, PlusCircle, CheckCircle2, Lock, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Account, Transaction, Bill, Alert } from '../types';

const accounts: Account[] = [
  { id: '1', type: 'checking', balance: 5420.50, accountNumber: '**** 1234' },
  { id: '2', type: 'savings', balance: 12750.75, accountNumber: '**** 5678', interestRate: 2.5 },
  { id: '3', type: 'investment', balance: 25000.00, accountNumber: '**** 9012', interestRate: 5.0 }
];

const recentTransactions: Transaction[] = [
  { id: '1', date: '2025-03-15', description: 'Grocery Store', amount: 85.50, type: 'debit', category: 'withdrawal', status: 'completed' },
  { id: '2', date: '2025-03-14', description: 'Salary Deposit', amount: 35000.00, type: 'credit', category: 'deposit', status: 'completed' },
  { id: '3', date: '2025-03-13', description: 'Electric Bill', amount: 145.80, type: 'debit', category: 'bill_payment', status: 'completed' }
];

const bills: Bill[] = [
  { id: '1', payee: 'Electric Company', amount: 150.00, dueDate: '2025-05-15', status: 'pending', category: 'utility' },
  { id: '2', payee: 'Credit Card', amount: 500.00, dueDate: '2025-05-20', status: 'pending', category: 'credit_card' },
  { id: '3', payee: 'Internet Service', amount: 89.99, dueDate: '2025-05-25', status: 'pending', category: 'utility' },
  { id: '4', payee: 'Phone Bill', amount: 75.00, dueDate: '2025-05-30', status: 'pending', category: 'utility' }
];

const alerts: Alert[] = [
  { id: '1', type: 'security', message: 'New device login detected', timestamp: '2025-03-15 14:30', read: false },
  { id: '2', type: 'bill', message: 'Upcoming bill payment due', timestamp: '2025-03-15 09:15', read: false }
];

interface Recipient {
  id: string;
  name: string;
  accountNumber: string;
  bank: string;
}

const demoRecipients: Recipient[] = [
  { id: '1', name: 'John Smith', accountNumber: '**** 4321', bank: 'Chase Bank' },
  { id: '2', name: 'Sarah Johnson', accountNumber: '**** 8765', bank: 'Bank of America' },
  { id: '3', name: 'Michael Brown', accountNumber: '**** 2468', bank: 'Wells Fargo' }
];

function SendMoneyModal({ isOpen, onClose, onSend }: { isOpen: boolean; onClose: () => void; onSend: (amount: number, recipient: Recipient, fromAccount: Account) => void }) {
  const [amount, setAmount] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecipients = demoRecipients.filter(recipient =>
    recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipient.accountNumber.includes(searchQuery)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRecipient && selectedAccount && amount) {
      onSend(parseFloat(amount), selectedRecipient, selectedAccount);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Send Money</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Recipient Search */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Recipient</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search recipient..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="mt-2 max-h-40 overflow-y-auto">
              {filteredRecipients.map(recipient => (
                <button
                  key={recipient.id}
                  type="button"
                  onClick={() => setSelectedRecipient(recipient)}
                  className={`w-full text-left p-3 rounded-lg mb-1 ${
                    selectedRecipient?.id === recipient.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">{recipient.name}</div>
                  <div className="text-sm text-gray-500">
                    {recipient.accountNumber} • {recipient.bank}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* From Account */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">From Account</label>
            <div className="space-y-2">
              {accounts.map(account => (
                <button
                  key={account.id}
                  type="button"
                  onClick={() => setSelectedAccount(account)}
                  className={`w-full text-left p-3 rounded-lg border ${
                    selectedAccount?.id === account.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium capitalize">{account.type}</div>
                      <div className="text-sm text-gray-500">{account.accountNumber}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${account.balance.toLocaleString()}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!selectedRecipient || !selectedAccount || !amount}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send Money
          </button>
        </form>
      </div>
    </div>
  );
}

function AddMoneyModal({ isOpen, onClose, onAdd, accounts }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onAdd: (amount: number, toAccount: Account) => void;
  accounts: Account[];
}) {
  const [amount, setAmount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [source, setSource] = useState<'bank' | 'card'>('bank');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAccount && amount) {
      onAdd(parseFloat(amount), selectedAccount);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        setAmount('');
        setSelectedAccount(null);
      }, 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Add Money</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        {showSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Success!</h3>
            <p className="text-gray-600">
              ${amount} has been added to your {selectedAccount?.type} account
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Source Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setSource('bank')}
                  className={`p-4 rounded-lg border ${
                    source === 'bank'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className={`h-5 w-5 ${
                      source === 'bank' ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <div className="text-left">
                      <p className="font-medium">Bank Account</p>
                      <p className="text-sm text-gray-500">Direct deposit</p>
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setSource('card')}
                  className={`p-4 rounded-lg border ${
                    source === 'card'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className={`h-5 w-5 ${
                      source === 'card' ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <div className="text-left">
                      <p className="font-medium">Debit Card</p>
                      <p className="text-sm text-gray-500">Instant transfer</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* To Account */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">To Account</label>
              <div className="space-y-2">
                {accounts.map(account => (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => setSelectedAccount(account)}
                    className={`w-full text-left p-3 rounded-lg border ${
                      selectedAccount?.id === account.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium capitalize">{account.type}</div>
                        <div className="text-sm text-gray-500">{account.accountNumber}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${account.balance.toLocaleString()}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!selectedAccount || !amount}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Money
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

interface PayBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPay: (bill: Bill, account: Account) => void;
  bill: Bill | null;
  accounts: Account[];
}

function PayBillModal({ isOpen, onClose, onPay, bill, accounts }: PayBillModalProps) {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [password, setPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAccount && bill && password) {
      onPay(bill, selectedAccount);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        setPassword('');
        setSelectedAccount(null);
      }, 2000);
    }
  };

  if (!isOpen || !bill) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Pay Bill</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        {showSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Successful!</h3>
            <p className="text-gray-600">
              ${bill.amount} has been paid to {bill.payee}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Bill Details */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Payee</span>
                <span className="font-medium">{bill.payee}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Amount</span>
                <span className="font-medium">${bill.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Due Date</span>
                <span className="font-medium">{bill.dueDate}</span>
              </div>
            </div>

            {/* From Account */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">From Account</label>
              <div className="space-y-2">
                {accounts.map(account => (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => setSelectedAccount(account)}
                    className={`w-full text-left p-3 rounded-lg border ${
                      selectedAccount?.id === account.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium capitalize">{account.type}</div>
                        <div className="text-sm text-gray-500">{account.accountNumber}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${account.balance.toLocaleString()}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!selectedAccount || !password}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Pay ${bill.amount.toLocaleString()}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

interface PayToMobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPay: (amount: number, mobileNumber: string, fromAccount: Account) => void;
  accounts: Account[];
}

function PayToMobileModal({ isOpen, onClose, onPay, accounts }: PayToMobileModalProps) {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [amount, setAmount] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordError, setShowPasswordError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAccount && amount && mobileNumber) {
      // Demo password validation (in a real app, this would be handled securely on the backend)
      if (password !== 'john1234') { // Demo password
        setShowPasswordError(true);
        return;
      }
      
      // Generate a random recipient name for the mobile number
      const demoNames = ['John Smith', 'Sarah Johnson', 'Michael Brown', 'Emma Wilson'];
      const randomName = demoNames[Math.floor(Math.random() * demoNames.length)];
      setRecipientName(randomName);
      
      onPay(parseFloat(amount), mobileNumber, selectedAccount);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        setAmount('');
        setMobileNumber('');
        setSelectedAccount(null);
        setPassword('');
        setShowPasswordError(false);
      }, 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Pay to Mobile Number</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        {showSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Successful!</h3>
            <p className="text-gray-600">
              ${amount} has been sent to {recipientName}
            </p>
            <p className="text-sm text-gray-500 mt-1">{mobileNumber}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Mobile Number */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="tel"
                  placeholder="Enter mobile number"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit mobile number"
                />
              </div>
            </div>

            {/* From Account */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">From Account</label>
              <div className="space-y-2">
                {accounts.map(account => (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => setSelectedAccount(account)}
                    className={`w-full text-left p-3 rounded-lg border ${
                      selectedAccount?.id === account.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium capitalize">{account.type}</div>
                        <div className="text-sm text-gray-500">{account.accountNumber}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${account.balance.toLocaleString()}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    showPasswordError ? 'border-red-500' : ''
                  }`}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setShowPasswordError(false);
                  }}
                  required
                />
              </div>
              {showPasswordError && (
                <p className="mt-1 text-sm text-red-600">Incorrect password. Please try again.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!selectedAccount || !amount || !mobileNumber || !password}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send Payment
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'bills' | 'alerts'>('overview');
  const [isSendMoneyModalOpen, setIsSendMoneyModalOpen] = useState(false);
  const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);
  const [isPayBillModalOpen, setIsPayBillModalOpen] = useState(false);
  const [isPayToMobileModalOpen, setIsPayToMobileModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [localAccounts, setLocalAccounts] = useState(accounts);
  const [localTransactions, setLocalTransactions] = useState(recentTransactions);
  const [localBills, setLocalBills] = useState(bills);

  const handleSendMoney = (amount: number, recipient: Recipient, fromAccount: Account) => {
    // Update account balance
    const updatedAccounts = localAccounts.map(account => {
      if (account.id === fromAccount.id) {
        return {
          ...account,
          balance: account.balance - amount
        };
      }
      return account;
    });
    setLocalAccounts(updatedAccounts);

    // Add new transaction
    const newTransaction: Transaction = {
      id: String(localTransactions.length + 1),
      date: new Date().toISOString().split('T')[0],
      description: `Transfer to ${recipient.name}`,
      amount: amount,
      type: 'debit',
      category: 'transfer',
      status: 'completed'
    };
    setLocalTransactions([newTransaction, ...localTransactions]);
  };

  const handleAddMoney = (amount: number, toAccount: Account) => {
    // Update account balance
    const updatedAccounts = localAccounts.map(account => {
      if (account.id === toAccount.id) {
        return {
          ...account,
          balance: account.balance + amount
        };
      }
      return account;
    });
    setLocalAccounts(updatedAccounts);

    // Add new transaction
    const newTransaction: Transaction = {
      id: String(localTransactions.length + 1),
      date: new Date().toISOString().split('T')[0],
      description: `Money Added to ${toAccount.type} Account`,
      amount: amount,
      type: 'credit',
      category: 'deposit',
      status: 'completed'
    };
    setLocalTransactions([newTransaction, ...localTransactions]);
  };

  const handlePayBill = (bill: Bill, fromAccount: Account) => {
    // Update account balance
    const updatedAccounts = localAccounts.map(account => {
      if (account.id === fromAccount.id) {
        return {
          ...account,
          balance: account.balance - bill.amount
        };
      }
      return account;
    });
    setLocalAccounts(updatedAccounts);

    // Update bill status
    const updatedBills = localBills.map(b => {
      if (b.id === bill.id) {
        return { ...b, status: 'paid' as const };
      }
      return b;
    });
    setLocalBills(updatedBills);

    // Add new transaction
    const newTransaction: Transaction = {
      id: String(localTransactions.length + 1),
      date: new Date().toISOString().split('T')[0],
      description: `Payment to ${bill.payee}`,
      amount: bill.amount,
      type: 'debit',
      category: 'bill_payment',
      status: 'completed'
    };
    setLocalTransactions([newTransaction, ...localTransactions]);
  };

  const handlePayToMobile = (amount: number, mobileNumber: string, fromAccount: Account) => {
    // Update account balance
    const updatedAccounts = localAccounts.map(account => {
      if (account.id === fromAccount.id) {
        return {
          ...account,
          balance: account.balance - amount
        };
      }
      return account;
    });
    setLocalAccounts(updatedAccounts);

    // Add new transaction with mobile payment details
    const newTransaction: Transaction = {
      id: String(localTransactions.length + 1),
      date: new Date().toISOString().split('T')[0],
      description: `Mobile Payment to ${mobileNumber} (${fromAccount.type} Account)`,
      amount: amount,
      type: 'debit',
      category: 'transfer',
      status: 'completed'
    };
    setLocalTransactions([newTransaction, ...localTransactions]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back,</h1>
            <p className="text-gray-600">Here's your financial overview</p>
          </div>
          <div className="flex gap-2">
            {alerts.filter(a => !a.read).length > 0 && (
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                {alerts.filter(a => !a.read).length} New Alerts
              </span>
            )}
          </div>
        </div>

        {/* Account Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {localAccounts.map(account => (
            <div key={account.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                  <h2 className="text-lg font-semibold capitalize">{account.type}</h2>
                </div>
                <span className="text-sm text-gray-500">{account.accountNumber}</span>
              </div>
              <p className="text-3xl font-bold mb-2">${account.balance.toLocaleString()}</p>
              {account.interestRate && (
                <p className="text-sm text-green-600">{account.interestRate}% APY</p>
              )}
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => setIsSendMoneyModalOpen(true)}
            className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-all"
          >
            <ArrowUpRight className="h-6 w-6 text-blue-600 mb-2" />
            <span className="text-sm font-medium">Send Money</span>
          </button>
          <button
            onClick={() => navigate('/bills')}
            className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-all"
          >
            <Receipt className="h-6 w-6 text-purple-600 mb-2" />
            <span className="text-sm font-medium">Pay Bills</span>
          </button>
          <button
            onClick={() => setIsAddMoneyModalOpen(true)}
            className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-all"
          >
            <Wallet className="h-6 w-6 text-green-600 mb-2" />
            <span className="text-sm font-medium">Add Money</span>
          </button>
          <button
            onClick={() => setIsPayToMobileModalOpen(true)}
            className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-all"
          >
            <Phone className="h-6 w-6 text-orange-600 mb-2" />
            <span className="text-sm font-medium">Pay to Mobile</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'bills', label: 'Bills', icon: Receipt },
            { id: 'alerts', label: 'Alerts', icon: AlertTriangle }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
            <div className="divide-y">
              {localTransactions.map(transaction => (
                <div key={transaction.id} className="py-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        transaction.category === 'bill_payment'
                          ? 'bg-orange-100 text-orange-800'
                          : transaction.category === 'transfer'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {transaction.category}
                      </span>
                    </div>
                  </div>
                  <span className={`font-medium ${
                    transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bills' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Upcoming Bills</h2>
            <div className="divide-y">
              {localBills.map(bill => (
                <div key={bill.id} className="py-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{bill.payee}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-500">Due: {bill.dueDate}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        bill.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : bill.status === 'overdue'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {bill.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium">${bill.amount.toLocaleString()}</span>
                    {bill.status === 'pending' && (
                      <button 
                        onClick={() => {
                          setSelectedBill(bill);
                          setIsPayBillModalOpen(true);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Security & Notifications</h2>
            <div className="divide-y">
              {alerts.map(alert => (
                <div key={alert.id} className="py-4 flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <span className={`p-2 rounded-full ${
                      alert.type === 'security'
                        ? 'bg-red-100 text-red-600'
                        : alert.type === 'transaction'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      <AlertTriangle className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-medium">{alert.message}</p>
                      <p className="text-sm text-gray-500">{alert.timestamp}</p>
                    </div>
                  </div>
                  {!alert.read && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                      New
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modals */}
        <SendMoneyModal
          isOpen={isSendMoneyModalOpen}
          onClose={() => setIsSendMoneyModalOpen(false)}
          onSend={handleSendMoney}
        />
        <AddMoneyModal
          isOpen={isAddMoneyModalOpen}
          onClose={() => setIsAddMoneyModalOpen(false)}
          onAdd={handleAddMoney}
          accounts={localAccounts}
        />
        <PayBillModal
          isOpen={isPayBillModalOpen}
          onClose={() => {
            setIsPayBillModalOpen(false);
            setSelectedBill(null);
          }}
          onPay={handlePayBill}
          bill={selectedBill}
          accounts={localAccounts}
        />
        <PayToMobileModal
          isOpen={isPayToMobileModalOpen}
          onClose={() => setIsPayToMobileModalOpen(false)}
          onPay={handlePayToMobile}
          accounts={localAccounts}
        />
      </div>
    </div>
  );
}