import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { Accounts } from './pages/Accounts';
import { Transactions } from './pages/Transactions';
import { Bills } from './pages/Bills';
import { Investments } from './pages/Investments';
import { Loans } from './pages/Loans';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/signin" />;
}

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/accounts" element={
          <PrivateRoute>
            <Accounts />
          </PrivateRoute>
        } />
        <Route path="/transactions" element={
          <PrivateRoute>
            <Transactions />
          </PrivateRoute>
        } />
        <Route path="/bills" element={
          <PrivateRoute>
            <Bills />
          </PrivateRoute>
        } />
        <Route path="/investments" element={
          <PrivateRoute>
            <Investments />
          </PrivateRoute>
        } />
        <Route path="/loans" element={
          <PrivateRoute>
            <Loans />
          </PrivateRoute>
        } />
      </Routes>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  );
}

export default AppWrapper;