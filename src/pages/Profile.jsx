import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { TransactionContext } from '../context/TransactionContext';
import { User, Mail, Lock, ShieldAlert, Sparkles, Bell, IndianRupee, Loader2, CheckCircle } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile, changePassword } = useContext(AuthContext);
  const { summary, updateBudget, fetchSummary } = useContext(TransactionContext);

  // Edit Profile States
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [passError, setPassError] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  // Budget Limit States
  const [budgetLimit, setBudgetLimit] = useState(summary?.budget?.limit || '0');
  const [alertEnabled, setAlertEnabled] = useState(summary?.budget?.alertEnabled || false);
  const [budgetSuccess, setBudgetSuccess] = useState('');
  const [budgetError, setBudgetError] = useState('');
  const [budgetLoading, setBudgetLoading] = useState(false);

  // Synchronise values on mount or context changes
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (summary?.budget) {
      setBudgetLimit(summary.budget.limit.toString());
      setAlertEnabled(summary.budget.alertEnabled);
    }
  }, [summary]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setProfileError('All profile fields are required');
      return;
    }

    setProfileError('');
    setProfileSuccess('');
    setProfileLoading(true);

    const result = await updateProfile(name.trim(), email.trim());

    setProfileLoading(false);
    if (result.success) {
      setProfileSuccess('Profile details updated successfully');
    } else {
      setProfileError(result.error);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPassError('All password fields are required');
      return;
    }

    if (newPassword.length < 6) {
      setPassError('New password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match');
      return;
    }

    setPassError('');
    setPassSuccess('');
    setPassLoading(true);

    const result = await changePassword(currentPassword, newPassword);

    setPassLoading(false);
    if (result.success) {
      setPassSuccess('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPassError(result.error);
    }
  };

  const handleBudgetUpdate = async (e) => {
    e.preventDefault();
    const limitNum = parseFloat(budgetLimit);

    if (isNaN(limitNum) || limitNum < 0) {
      setBudgetError('Please enter a valid positive number for the budget limit');
      return;
    }

    setBudgetError('');
    setBudgetSuccess('');
    setBudgetLoading(true);

    const result = await updateBudget(limitNum, alertEnabled);

    setBudgetLoading(false);
    if (result.success) {
      setBudgetSuccess('Monthly budget limit updated successfully');
      fetchSummary(); // Refresh metrics
    } else {
      setBudgetError(result.error);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
          Account Settings
        </h1>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
          Configure profile details, change passwords, and set monthly limits
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Details Editing Form */}
        <div className="p-6 border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-3xl hover-card animate-slide-up space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-350">
            <User className="w-4.5 h-4.5 text-violet-500" />
            Update Profile Information
          </div>

          {profileSuccess && (
            <div className="p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-2xl dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-400">
              {profileSuccess}
            </div>
          )}

          {profileError && (
            <div className="p-4 bg-red-50 text-red-700 border border-red-200 text-xs font-bold rounded-2xl dark:bg-red-950/20 dark:border-red-900/40 dark:text-red-400">
              {profileError}
            </div>
          )}

          <form onSubmit={handleProfileUpdate} className="space-y-4.5">
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 dark:bg-slate-950/40 dark:focus:bg-slate-950 text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 dark:bg-slate-950/40 dark:focus:bg-slate-950 text-xs font-semibold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="flex items-center justify-center px-4 py-2.5 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 active:bg-violet-800 disabled:bg-violet-600/60 rounded-xl shadow-md cursor-pointer"
            >
              {profileLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="p-6 border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-3xl hover-card animate-slide-up space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-350">
            <Lock className="w-4.5 h-4.5 text-violet-500" />
            Security & Password Change
          </div>

          {passSuccess && (
            <div className="p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-2xl dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-400">
              {passSuccess}
            </div>
          )}

          {passError && (
            <div className="p-4 bg-red-50 text-red-700 border border-red-200 text-xs font-bold rounded-2xl dark:bg-red-950/20 dark:border-red-900/40 dark:text-red-400">
              {passError}
            </div>
          )}

          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 dark:bg-slate-950/40 dark:focus:bg-slate-950 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 dark:bg-slate-950/40 dark:focus:bg-slate-950 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 dark:bg-slate-950/40 dark:focus:bg-slate-950 text-xs font-semibold"
              />
            </div>

            <button
              type="submit"
              disabled={passLoading}
              className="flex items-center justify-center px-4 py-2.5 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 active:bg-violet-800 disabled:bg-violet-600/60 rounded-xl shadow-md cursor-pointer"
            >
              {passLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  Updating...
                </>
              ) : (
                'Change Password'
              )}
            </button>
          </form>
        </div>

        {/* Set Budget Limits Panel */}
        <div className="p-6 border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-3xl hover-card animate-slide-up space-y-4 md:col-span-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-355">
            <Bell className="w-4.5 h-4.5 text-violet-500" />
            Monthly Budget Spending Limit
          </div>

          {budgetSuccess && (
            <div className="p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-2xl dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-400">
              {budgetSuccess}
            </div>
          )}

          {budgetError && (
            <div className="p-4 bg-red-50 text-red-700 border border-red-200 text-xs font-bold rounded-2xl dark:bg-red-950/20 dark:border-red-900/40 dark:text-red-400">
              {budgetError}
            </div>
          )}

          <form onSubmit={handleBudgetUpdate} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  Monthly Limit Target (₹)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <IndianRupee className="w-4 h-4" />
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={budgetLimit}
                    onChange={(e) => setBudgetLimit(e.target.value)}
                    placeholder="Enter limit e.g. 2000"
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 dark:bg-slate-950/40 dark:focus:bg-slate-950 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 p-4 dark:bg-slate-950/20">
                <input
                  type="checkbox"
                  id="budget-alert-enabled"
                  checked={alertEnabled}
                  onChange={(e) => setAlertEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-violet-600 border-slate-300 focus:ring-violet-500 cursor-pointer"
                />
                <label htmlFor="budget-alert-enabled" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Enable alert triggers & banners when exceeding limits
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={budgetLoading}
              className="flex items-center justify-center px-4 py-2.5 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 active:bg-violet-800 disabled:bg-violet-600/60 rounded-xl shadow-md cursor-pointer"
            >
              {budgetLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  Saving Limit...
                </>
              ) : (
                'Save Budget Settings'
              )}
            </button>
          </form>
        </div>
      </div>

    </div>
  );
};

export default Profile;
