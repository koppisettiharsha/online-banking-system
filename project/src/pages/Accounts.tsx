import React, { useState } from 'react';
import { CreditCard, ArrowUpRight, PlusCircle, BarChart3, X, ArrowRight, Download, Calendar, TrendingUp, TrendingDown, DollarSign, ArrowUp, ArrowDown } from 'lucide-react';
import type { Account } from '../types';

const accounts: Account[] = [
  { id: '1', type: 'checking', balance: 5420.50, accountNumber: '**** 1234' },
  { id: '2', type: 'savings', balance: 12750.75, accountNumber: '**** 5678', interestRate: 2.5 },
  { id: '3', type: 'investment', balance: 25000.00, accountNumber: '**** 9012', interestRate: 5.0 }
];

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  onTransfer: (fromAccount: Account, toAccount: Account, amount: number) => void;
}

function TransferModal({ isOpen, onClose, accounts, onTransfer }: TransferModalProps) {
  const [fromAccount, setFromAccount] = useState<Account | null>(null);
  const [toAccount, setToAccount] = useState<Account | null>(null);
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'select' | 'confirm'>('select');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromAccount && toAccount && amount) {
      if (step === 'select') {
        setStep('confirm');
      } else {
        onTransfer(fromAccount, toAccount, parseFloat(amount));
        onClose();
        // Reset form
        setFromAccount(null);
        setToAccount(null);
        setAmount('');
        setStep('select');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {step === 'select' ? 'Transfer Money' : 'Confirm Transfer'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 'select' ? (
            <>
              {/* From Account */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">From Account</label>
                <div className="space-y-2">
                  {accounts.map(account => (
                    <button
                      key={account.id}
                      type="button"
                      onClick={() => setFromAccount(account)}
                      className={`w-full text-left p-3 rounded-lg border ${
                        fromAccount?.id === account.id
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

              {/* To Account */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">To Account</label>
                <div className="space-y-2">
                  {accounts
                    .filter(account => account.id !== fromAccount?.id)
                    .map(account => (
                      <button
                        key={account.id}
                        type="button"
                        onClick={() => setToAccount(account)}
                        className={`w-full text-left p-3 rounded-lg border ${
                          toAccount?.id === account.id
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
                    max={fromAccount?.balance}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
                {fromAccount && (
                  <p className="text-sm text-gray-500 mt-1">
                    Available: ${fromAccount.balance.toLocaleString()}
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">From</p>
                    <p className="font-medium capitalize">{fromAccount?.type}</p>
                    <p className="text-sm text-gray-500">{fromAccount?.accountNumber}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                  <div className="text-right">
                    <p className="text-sm text-gray-500">To</p>
                    <p className="font-medium capitalize">{toAccount?.type}</p>
                    <p className="text-sm text-gray-500">{toAccount?.accountNumber}</p>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="text-2xl font-bold">${parseFloat(amount).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {step === 'confirm' && (
              <button
                type="button"
                onClick={() => setStep('select')}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              disabled={!fromAccount || !toAccount || !amount}
              className={`flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed ${
                step === 'confirm' ? 'flex-1' : 'w-full'
              }`}
            >
              {step === 'select' ? 'Continue' : 'Confirm Transfer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface Statement {
  id: string;
  month: string;
  year: string;
  transactions: number;
  totalInflow: number;
  totalOutflow: number;
  netChange: number;
  status: 'available' | 'pending';
}

interface AnalyticsData {
  monthlyBalance: { month: string; balance: number }[];
  topCategories: { category: string; amount: number; type: 'income' | 'expense' }[];
  recentTrends: { date: string; amount: number; type: 'increase' | 'decrease' }[];
}

const demoStatements: Statement[] = [
  {
    id: '1',
    month: 'March',
    year: '2024',
    transactions: 24,
    totalInflow: 35000.00,
    totalOutflow: 12500.75,
    netChange: 22499.25,
    status: 'available'
  },
  {
    id: '2',
    month: 'February',
    year: '2024',
    transactions: 18,
    totalInflow: 28000.00,
    totalOutflow: 15800.50,
    netChange: 12199.50,
    status: 'available'
  },
  {
    id: '3',
    month: 'January',
    year: '2024',
    transactions: 22,
    totalInflow: 32000.00,
    totalOutflow: 14200.25,
    netChange: 17799.75,
    status: 'available'
  }
];

const demoAnalytics: AnalyticsData = {
  monthlyBalance: [
    { month: 'Jan', balance: 15000 },
    { month: 'Feb', balance: 18000 },
    { month: 'Mar', balance: 22000 },
    { month: 'Apr', balance: 25000 }
  ],
  topCategories: [
    { category: 'Salary', amount: 35000, type: 'income' },
    { category: 'Rent', amount: 2000, type: 'expense' },
    { category: 'Utilities', amount: 500, type: 'expense' },
    { category: 'Investments', amount: 5000, type: 'income' }
  ],
  recentTrends: [
    { date: '2024-03-15', amount: 1500, type: 'increase' },
    { date: '2024-03-10', amount: 800, type: 'decrease' },
    { date: '2024-03-05', amount: 2000, type: 'increase' }
  ]
};

function StatementModal({ isOpen, onClose, account }: { isOpen: boolean; onClose: () => void; account: Account }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">Account Statements</h2>
            <p className="text-sm text-gray-500">{account.type} Account • {account.accountNumber}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {demoStatements.map(statement => (
            <div key={statement.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium">{statement.month} {statement.year}</h3>
                  <p className="text-sm text-gray-500">{statement.transactions} transactions</p>
                </div>
                <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                  <Download className="h-4 w-4" />
                  <span>Download PDF</span>
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total Inflow</p>
                  <p className="font-medium text-green-600">+${statement.totalInflow.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Outflow</p>
                  <p className="font-medium text-red-600">-${statement.totalOutflow.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Net Change</p>
                  <p className="font-medium text-blue-600">${statement.netChange.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnalyticsModal({ isOpen, onClose, account }: { isOpen: boolean; onClose: () => void; account: Account }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">Account Analytics</h2>
            <p className="text-sm text-gray-500">{account.type} Account • {account.accountNumber}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Monthly Balance Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Monthly Balance</h3>
            <div className="h-48 flex items-end gap-4">
              {demoAnalytics.monthlyBalance.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-100 rounded-t"
                    style={{ height: `${(data.balance / 30000) * 100}%` }}
                  />
                  <span className="text-sm text-gray-500 mt-2">{data.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Categories */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Top Categories</h3>
            <div className="space-y-4">
              {demoAnalytics.topCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      category.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {category.type === 'income' ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <span className="font-medium">{category.category}</span>
                  </div>
                  <span className={`font-medium ${
                    category.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {category.type === 'income' ? '+' : '-'}${category.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Trends */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Trends</h3>
            <div className="space-y-4">
              {demoAnalytics.recentTrends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      trend.type === 'increase' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {trend.type === 'increase' ? (
                        <ArrowUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <span className="text-gray-500">{trend.date}</span>
                  </div>
                  <span className={`font-medium ${
                    trend.type === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {trend.type === 'increase' ? '+' : '-'}${trend.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Accounts() {
  const [activeAccount, setActiveAccount] = useState<string>(accounts[0].id);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isStatementModalOpen, setIsStatementModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [localAccounts, setLocalAccounts] = useState(accounts);

  const handleTransfer = (fromAccount: Account, toAccount: Account, amount: number) => {
    const updatedAccounts = localAccounts.map(account => {
      if (account.id === fromAccount.id) {
        return {
          ...account,
          balance: account.balance - amount
        };
      }
      if (account.id === toAccount.id) {
        return {
          ...account,
          balance: account.balance + amount
        };
      }
      return account;
    });
    setLocalAccounts(updatedAccounts);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Your Accounts</h1>
        <p className="text-gray-600">Manage your accounts and view detailed information</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Accounts List */}
        <div className="lg:col-span-1 space-y-4">
          {localAccounts.map(account => (
            <button
              key={account.id}
              onClick={() => setActiveAccount(account.id)}
              className={`w-full p-4 rounded-lg border transition-all ${
                activeAccount === account.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className={`h-5 w-5 ${
                  activeAccount === account.id ? 'text-blue-600' : 'text-gray-400'
                }`} />
                <div className="text-left">
                  <p className="font-medium capitalize">{account.type}</p>
                  <p className="text-sm text-gray-500">{account.accountNumber}</p>
                </div>
              </div>
            </button>
          ))}
          <button className="w-full p-4 rounded-lg border border-dashed border-gray-300 hover:border-blue-300 transition-all">
            <div className="flex items-center justify-center gap-2 text-gray-500 hover:text-blue-600">
              <PlusCircle className="h-5 w-5" />
              <span>Add New Account</span>
            </div>
          </button>
        </div>

        {/* Account Details */}
        <div className="lg:col-span-3">
          {localAccounts.map(account => (
            account.id === activeAccount && (
              <div key={account.id} className="space-y-6">
                {/* Balance Card */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold capitalize">{account.type} Account</h2>
                    <span className="text-sm text-gray-500">{account.accountNumber}</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <p className="text-3xl font-bold">${account.balance.toLocaleString()}</p>
                    {account.interestRate && (
                      <p className="text-sm text-green-600 mb-1">
                        {account.interestRate}% APY
                      </p>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: ArrowUpRight, label: 'Transfer', color: 'text-blue-600', onClick: () => setIsTransferModalOpen(true) },
                    { icon: CreditCard, label: 'Statements', color: 'text-purple-600', onClick: () => setIsStatementModalOpen(true) },
                    { icon: BarChart3, label: 'Analytics', color: 'text-green-600', onClick: () => setIsAnalyticsModalOpen(true) }
                  ].map((action, index) => (
                    <button
                      key={index}
                      onClick={action.onClick}
                      className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-all"
                    >
                      <action.icon className={`h-6 w-6 ${action.color} mb-2`} />
                      <span className="text-sm font-medium">{action.label}</span>
                    </button>
                  ))}
                </div>

                {/* Account Information */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4">Account Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Account Type</p>
                      <p className="font-medium capitalize">{account.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Account Number</p>
                      <p className="font-medium">{account.accountNumber}</p>
                    </div>
                    {account.interestRate && (
                      <div>
                        <p className="text-sm text-gray-500">Interest Rate</p>
                        <p className="font-medium">{account.interestRate}% APY</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-medium text-green-600">Active</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Modals */}
      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        accounts={localAccounts}
        onTransfer={handleTransfer}
      />
      <StatementModal
        isOpen={isStatementModalOpen}
        onClose={() => setIsStatementModalOpen(false)}
        account={localAccounts.find(a => a.id === activeAccount)!}
      />
      <AnalyticsModal
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
        account={localAccounts.find(a => a.id === activeAccount)!}
      />
    </div>
  );
}