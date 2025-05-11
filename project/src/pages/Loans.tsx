import React, { useState } from 'react';
import { DollarSign, Calendar, TrendingUp, TrendingDown, CreditCard, X, CheckCircle2, AlertTriangle } from 'lucide-react';
import type { Loan, LoanApplication } from '../types';

const demoLoans: Loan[] = [
  {
    id: '1',
    type: 'personal',
    amount: 10000,
    interestRate: 5.5,
    term: 24,
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2026-01-15',
    monthlyPayment: 440.96,
    remainingBalance: 8800.00,
    purpose: 'Home Renovation'
  },
  {
    id: '2',
    type: 'car',
    amount: 25000,
    interestRate: 4.2,
    term: 60,
    status: 'active',
    startDate: '2023-06-01',
    endDate: '2028-06-01',
    monthlyPayment: 462.50,
    remainingBalance: 20000.00,
    purpose: 'New Car Purchase'
  }
];

const loanTypes = [
  { type: 'personal', name: 'Personal Loan', minAmount: 1000, maxAmount: 50000, maxTerm: 60 },
  { type: 'home', name: 'Home Loan', minAmount: 50000, maxAmount: 1000000, maxTerm: 360 },
  { type: 'car', name: 'Car Loan', minAmount: 5000, maxAmount: 100000, maxTerm: 84 },
  { type: 'business', name: 'Business Loan', minAmount: 10000, maxAmount: 500000, maxTerm: 120 }
];

function ApplyLoanModal({ isOpen, onClose, onSubmit }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (application: LoanApplication) => void;
}) {
  const [step, setStep] = useState<'type' | 'details'>('type');
  const [selectedType, setSelectedType] = useState<LoanApplication['type'] | null>(null);
  const [amount, setAmount] = useState('');
  const [term, setTerm] = useState('');
  const [purpose, setPurpose] = useState('');
  const [income, setIncome] = useState('');
  const [employmentStatus, setEmploymentStatus] = useState<LoanApplication['employmentStatus']>('employed');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedType && amount && term && purpose && income) {
      const application: LoanApplication = {
        type: selectedType,
        amount: parseFloat(amount),
        term: parseInt(term),
        purpose,
        income: parseFloat(income),
        employmentStatus
      };
      onSubmit(application);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        setStep('type');
        setSelectedType(null);
        setAmount('');
        setTerm('');
        setPurpose('');
        setIncome('');
        setEmploymentStatus('employed');
      }, 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {step === 'type' ? 'Select Loan Type' : 'Loan Application'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        {showSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Application Submitted!</h3>
            <p className="text-gray-600">We'll review your application and get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {step === 'type' ? (
              <div className="space-y-4">
                {loanTypes.map(loanType => (
                  <button
                    key={loanType.type}
                    type="button"
                    onClick={() => {
                      setSelectedType(loanType.type as LoanApplication['type']);
                      setStep('details');
                    }}
                    className="w-full p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{loanType.name}</h3>
                        <p className="text-sm text-gray-500">
                          ${loanType.minAmount.toLocaleString()} - ${loanType.maxAmount.toLocaleString()}
                        </p>
                      </div>
                      <CreditCard className="h-5 w-5 text-blue-600" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      min={loanTypes.find(t => t.type === selectedType)?.minAmount}
                      max={loanTypes.find(t => t.type === selectedType)?.maxAmount}
                      step="1000"
                      className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loan Term (months)</label>
                  <input
                    type="number"
                    min="12"
                    max={loanTypes.find(t => t.type === selectedType)?.maxTerm}
                    step="12"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Annual Income</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={income}
                      onChange={(e) => setIncome(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employment Status</label>
                  <select
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={employmentStatus}
                    onChange={(e) => setEmploymentStatus(e.target.value as LoanApplication['employmentStatus'])}
                    required
                  >
                    <option value="employed">Employed</option>
                    <option value="self-employed">Self-Employed</option>
                    <option value="business-owner">Business Owner</option>
                  </select>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setStep('type')}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Submit Application
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

export function Loans() {
  const [loans, setLoans] = useState<Loan[]>(demoLoans);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const handleApplyLoan = (application: LoanApplication) => {
    // Create a new loan with pending status
    const newLoan: Loan = {
      id: (loans.length + 1).toString(),
      type: application.type,
      amount: application.amount,
      interestRate: 0, // Will be set after approval
      term: application.term,
      status: 'pending',
      purpose: application.purpose,
      // Other fields will be set after approval
    };

    // Add the new loan to the list
    setLoans(prevLoans => [...prevLoans, newLoan]);
  };

  const totalBorrowed = loans.reduce((sum, loan) => sum + loan.amount, 0);
  const totalRemaining = loans.reduce((sum, loan) => sum + (loan.remainingBalance || 0), 0);
  const totalPaid = totalBorrowed - totalRemaining;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Loans</h1>
        <p className="text-gray-600">Manage your loans and apply for new ones</p>
      </div>

      {/* Loan Overview */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Total Borrowed</h3>
            <DollarSign className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ${totalBorrowed.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Total amount borrowed across all loans
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Remaining Balance</h3>
            <CreditCard className="h-5 w-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ${totalRemaining.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Total amount still to be paid
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Total Paid</h3>
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ${totalPaid.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Total amount paid so far
          </p>
        </div>
      </div>

      {/* Active Loans */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Active Loans</h2>
          <button
            onClick={() => setIsApplyModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Apply for a Loan
          </button>
        </div>

        <div className="space-y-4">
          {loans.map(loan => (
            <div key={loan.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium capitalize">{loan.type} Loan</h3>
                  <p className="text-sm text-gray-500">{loan.purpose}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  loan.status === 'active' ? 'bg-green-100 text-green-800' :
                  loan.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-medium">${loan.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Interest Rate</p>
                  <p className="font-medium">{loan.interestRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Monthly Payment</p>
                  <p className="font-medium">${loan.monthlyPayment?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Remaining Balance</p>
                  <p className="font-medium">${loan.remainingBalance?.toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Started: {new Date(loan.startDate!).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Ends: {new Date(loan.endDate!).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loan Application Modal */}
      <ApplyLoanModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSubmit={handleApplyLoan}
      />
    </div>
  );
} 