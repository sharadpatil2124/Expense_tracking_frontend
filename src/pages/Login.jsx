import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Loader2, Wallet } from 'lucide-react';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate('/dashboard');
    } else if (result.requiresVerification) {
      setError(result.error);
      setTimeout(() => {
        navigate(`/verify-email?email=${encodeURIComponent(result.email || email)}`);
      }, 2000);
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-slate-50 dark:bg-slate-950 transition-colors animate-fade-in">
      <div className="w-full max-w-md p-8 bg-white border border-slate-200 shadow-xl rounded-3xl dark:bg-slate-900 dark:border-slate-800">
        
        {/* Logo/Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-12 h-12 mb-3 bg-violet-600 text-white rounded-2xl shadow-lg shadow-violet-500/25">
            <Wallet className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
            Welcome to WealthFlow
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1.5">
            Log in to manage your personal finance
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4.5 mb-6 border border-red-200 bg-red-50 text-red-700 rounded-2xl dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-400 text-sm font-semibold">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 dark:bg-slate-950/40 dark:focus:bg-slate-950 text-sm font-semibold transition-all duration-150"
                id="login-email-input"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs font-bold text-violet-600 hover:text-violet-750 dark:text-violet-400 dark:hover:text-violet-300">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-11 py-3 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 dark:bg-slate-950/40 dark:focus:bg-slate-950 text-sm font-semibold transition-all duration-150"
                id="login-password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center w-full py-3.5 font-bold text-white bg-violet-600 hover:bg-violet-700 active:bg-violet-800 disabled:bg-violet-600/60 rounded-2xl shadow-lg shadow-violet-500/20 transition-all duration-150 cursor-pointer"
            id="login-submit-btn"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300">
            Sign up for free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
