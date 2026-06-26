import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, CheckCircle2, Loader2, ArrowLeft, RefreshCw } from 'lucide-react';
import apiClient from '../api/apiClient';

const VerifyEmail = () => {
  const { verifyEmail } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email') || '';

  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [cooldown, setCooldown] = useState(0);

  // Timer logic for resending code
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !otp) {
      setError('Please fill in all fields');
      return;
    }
    if (otp.length !== 6) {
      setError('Verification code must be exactly 6 digits');
      return;
    }

    setError('');
    setSuccessMsg('');
    setLoading(true);

    const result = await verifyEmail(email, otp);

    if (result.success) {
      setSuccessMsg('Email verified successfully! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;

    setError('');
    setSuccessMsg('');
    setResending(true);

    try {
      const res = await apiClient.post('/auth/resend-otp', { email });
      if (res.data && res.data.success) {
        setSuccessMsg('A new verification code has been sent to your email.');
        setCooldown(60); // 60 seconds cooldown
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend code. Please try again.');
    } finally {
      setResending(false);
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
            <Mail className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
            Verify Your Email
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2 px-4">
            We sent a 6-digit verification OTP to your email address: <span className="font-extrabold text-slate-700 dark:text-slate-200">{email || 'your email'}</span>
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="p-4 mb-6 border border-red-200 bg-red-50 text-red-700 rounded-2xl dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-400 text-xs font-semibold">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-4 mb-6 border border-emerald-250 bg-emerald-50 text-emerald-700 rounded-2xl dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            {successMsg}
          </div>
        )}

        {/* Verification Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {!emailParam && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Confirm Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 dark:bg-slate-950/40 dark:focus:bg-slate-950 text-sm font-semibold transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 text-center">
              Verification Code (OTP)
            </label>
            <div className="relative max-w-[240px] mx-auto">
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  setOtp(val);
                }}
                placeholder="000000"
                className="w-full text-center py-3.5 tracking-[0.8em] pl-[0.8em] text-2xl font-extrabold border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 dark:bg-slate-950/40 dark:focus:bg-slate-950 transition-all font-mono"
                id="otp-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="flex items-center justify-center w-full py-3.5 font-bold text-white bg-violet-600 hover:bg-violet-700 active:bg-violet-800 disabled:bg-violet-600/40 rounded-2xl shadow-lg shadow-violet-500/20 transition-all cursor-pointer"
            id="verify-submit-btn"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify Account'
            )}
          </button>
        </form>

        {/* Resend Cooldown Section */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 text-center">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Didn't receive the email code?
          </p>
          <button
            type="button"
            disabled={cooldown > 0 || resending}
            onClick={handleResend}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 disabled:text-slate-400 dark:disabled:text-slate-600 transition-colors cursor-pointer"
            id="resend-code-btn"
          >
            {resending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Resending...
              </>
            ) : cooldown > 0 ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                Resend in {cooldown}s
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                Resend Verification Code
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default VerifyEmail;
