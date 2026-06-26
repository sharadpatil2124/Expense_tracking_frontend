import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, ShieldCheck, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import apiClient from '../api/apiClient';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email') || '';

  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !otp || !newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (otp.length !== 6) {
      setError('Reset code must be exactly 6 digits');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await apiClient.post('/auth/reset-password', {
        email,
        otp,
        newPassword
      });
      if (res.data && res.data.success) {
        setSuccess('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password. Please check OTP code.');
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-slate-50 dark:bg-slate-950 transition-colors animate-fade-in">
      <div className="w-full max-w-md p-8 bg-white border border-slate-200 shadow-xl rounded-3xl dark:bg-slate-900 dark:border-slate-800 animate-slide-up">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link to="/forgot-password" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>

        {/* Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="flex items-center justify-center w-12 h-12 mb-3 bg-violet-100 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400 rounded-2xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
            Reset Password
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2 px-4">
            Enter the 6-digit code sent to your email along with your new password.
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
            {success}
          </div>
        )}

        {/* Reset Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4.5">
          {!emailParam && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
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
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 text-center">
              Verification Code (OTP)
            </label>
            <div className="relative max-w-[200px] mx-auto">
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="000000"
                className="w-full text-center py-2.5 tracking-[0.6em] pl-[0.6em] text-xl font-extrabold border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 dark:bg-slate-950/40 dark:focus:bg-slate-950 transition-all font-mono"
                id="reset-otp-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 dark:bg-slate-950/40 dark:focus:bg-slate-950 text-sm font-semibold transition-all duration-150"
                id="reset-password-input"
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

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 dark:bg-slate-950/40 dark:focus:bg-slate-950 text-sm font-semibold transition-all duration-150"
                id="reset-confirm-password-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center w-full mt-4 py-3.5 font-bold text-white bg-violet-600 hover:bg-violet-700 active:bg-violet-800 disabled:bg-violet-600/60 rounded-2xl shadow-lg shadow-violet-500/20 transition-all duration-150 cursor-pointer"
            id="reset-password-submit-btn"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Resetting Password...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

export default ResetPassword;
