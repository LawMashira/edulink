import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(email, password);
    if (success) {
      toast.success('Login successful! Welcome back.');
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
      toast.error('Login failed. Please check your credentials.');
    }
  };

  const demoAccounts = [
    { email: 'admin@zimeedulink.com', password: 'password', role: 'Super Admin' },
    { email: 'headmaster@school1.co.zw', password: 'password', role: 'School Admin' },
    { email: 'teacher1@school1.co.zw', password: 'password', role: 'Teacher' },
    { email: 'parent1@email.com', password: 'password', role: 'Parent' },
    { email: 'student1@school1.co.zw', password: 'password', role: 'Student' },
    { email: 'vendor@edubooks.co.zw', password: 'password', role: 'Vendor' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-3">
      <div className="max-w-xl w-full">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="text-center mb-5">
            <img src="/images/edulink.jpg" alt="ZimEduLink" className="h-12 w-auto mx-auto mb-2" />
            <p className="text-sm text-gray-600">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="email@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
                Password *
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2.5 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 font-medium"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4">
            <h3 className="text-xs font-medium text-gray-700 mb-2">Quick Login:</h3>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.slice(0, 4).map((account, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setEmail(account.email);
                    setPassword(account.password);
                  }}
                  className="text-left p-2 bg-gray-50 hover:bg-gray-100 rounded text-xs border border-gray-200"
                >
                  <div className="font-medium text-gray-900">{account.role}</div>
                  <div className="text-gray-500 truncate">{account.email}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
