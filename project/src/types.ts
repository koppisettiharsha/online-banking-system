export interface Account {
  id: string;
  type: 'checking' | 'savings' | 'investment';
  balance: number;
  accountNumber: string;
  interestRate?: number;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  category?: 'transfer' | 'bill_payment' | 'deposit' | 'withdrawal';
  status: 'completed' | 'pending' | 'failed';
}

export interface Bill {
  id: string;
  payee: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  category: 'utility' | 'credit_card' | 'loan' | 'other';
}

export interface Alert {
  id: string;
  type: 'security' | 'transaction' | 'account' | 'bill';
  message: string;
  timestamp: string;
  read: boolean;
}

export interface Loan {
  id: string;
  type: 'personal' | 'home' | 'car' | 'business';
  amount: number;
  interestRate: number;
  term: number; // in months
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'paid';
  startDate?: string;
  endDate?: string;
  monthlyPayment?: number;
  remainingBalance?: number;
  purpose?: string;
}

export interface LoanApplication {
  type: 'personal' | 'home' | 'car' | 'business';
  amount: number;
  term: number;
  purpose: string;
  income: number;
  employmentStatus: 'employed' | 'self-employed' | 'business-owner';
  creditScore?: number;
}