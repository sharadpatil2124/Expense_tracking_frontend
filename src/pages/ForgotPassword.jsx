import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, KeyRound, Loader2, ArrowLeft } from 'lucide-react';
import apiClient from '../api/apiClient';

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await apiClient.post('/auth/forgot-password', { email });
      if (res.data && res.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate(`/reset-password?email=${encodeURIComponent(email)}`);
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to request password reset. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-slate-50 dark:bg-slate-950 transition-colors animate-fade-in">
      <div className="w-full max-w-md p-8 bg-white border border-slate-200 shadow-xl rounded-3xl dark:bg-slate-900 dark:border-slate-800 animate-slide-up">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>

        {/* Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="flex items-center justify-center w-12 h-12 mb-3 bg-violet-100 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400 rounded-2xl">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
            Forgot Password?
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2 px-4">
            Enter your email address and we'll send you a 6-digit One-Time Password (OTP) to reset your password.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4.5 mb-6 border border-red-200 bg-red-50 text-red-700 rounded-2xl dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-400 text-sm font-semibold">
            {error}
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="p-4.5 mb-6 border border-emerald-250 bg-emerald-50 text-emerald-700 rounded-2xl dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-400 text-sm font-semibold">
            Reset code sent! Redirecting to password reset page...
          </div>
        )}

        {/* Forgot Form */}
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
                id="forgot-email-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="flex items-center justify-center w-full py-3.5 font-bold text-white bg-violet-600 hover:bg-violet-700 active:bg-violet-800 disabled:bg-violet-600/60 rounded-2xl shadow-lg shadow-violet-500/20 transition-all duration-150 cursor-pointer"
            id="forgot-submit-btn"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Sending Code...
              </>
            ) : (
              'Send Reset Code'
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

export default ForgotPassword;
