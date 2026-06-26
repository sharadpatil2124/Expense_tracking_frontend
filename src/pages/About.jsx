import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Wallet, Shield, BarChart3, Bell, ArrowRight } from 'lucide-react';

const About = () => {
  const { isAuthenticated } = useContext(AuthContext);

  const features = [
    {
      title: 'Secure JWT Authentication',
      desc: 'Industry standard authentication using secure bcryptjs hashing and JSON Web Token security, with route guarding and secure middleware verification.',
      icon: Shield,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20'
    },
    {
      title: 'SaaS Finance Analytics',
      desc: 'Interactive Recharts components rendering expenses breakdown, monthly income vs expense analytics, and category distributions.',
      icon: BarChart3,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20'
    },
    {
      title: 'Budget Limit & Warnings',
      desc: 'Define monthly thresholds. Receive instant UI warning notifications and indicators if transactions exceed your savings target goals.',
      icon: Bell,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Header Banner */}
      <nav className="flex items-center justify-between max-w-6xl mx-auto px-6 py-4 h-16">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-600 text-white shadow-md shadow-violet-500/20">
            <Wallet className="w-4.5 h-4.5" />
          </div>
          <span className="font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">WealthFlow</span>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="px-4 py-2 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition-all shadow-md shadow-violet-500/10"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition-all shadow-md shadow-violet-500/10"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-blue-400">
          WealthFlow SaaS Finance
        </h1>
        <p className="max-w-2xl mx-auto mt-4 text-base sm:text-lg font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
          A production-ready, security-focused MERN stack financial management platform. Track transactions, monitor budget caps, analyze spending distributions, and optimize savings rates with absolute ease.
        </p>

        <div className="flex justify-center gap-4 mt-8">
          <Link
            to={isAuthenticated ? '/dashboard' : '/signup'}
            className="flex items-center gap-2 px-6 py-3 font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-2xl shadow-lg shadow-violet-500/25 transition-all"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid gap-6 mt-16 sm:grid-cols-3 text-left">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div 
                key={index} 
                className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-xl mb-4 ${feat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{feat.title}</h3>
                <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Tech Stack Specs */}
        <section className="mt-20 p-8 rounded-3xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 text-left">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">MERN System Architecture</h2>
          <div className="grid gap-6 sm:grid-cols-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <div>
              <h4 className="text-violet-600 dark:text-violet-400 font-bold uppercase tracking-wider mb-2">Frontend Client</h4>
              <ul className="space-y-1.5 list-disc pl-4">
                <li>React.js (Vite compiler)</li>
                <li>Tailwind CSS v4 engine</li>
                <li>Context API + useReducer architecture</li>
                <li>Recharts data visualizations</li>
              </ul>
            </div>
            <div>
              <h4 className="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider mb-2">Backend Server</h4>
              <ul className="space-y-1.5 list-disc pl-4">
                <li>Node.js & Express.js REST APIs</li>
                <li>MongoDB Atlas & Mongoose schemas</li>
                <li>JWT session validations & bcryptjs security</li>
                <li>Helmet headers & API Rate Limiting</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-8 border-t border-slate-200 dark:border-slate-800 mt-16 text-center text-xs font-bold text-slate-400 dark:text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© 2026 WealthFlow Platform. All rights reserved.</p>
        <div className="flex gap-4">
          <Link to="/about" className="hover:text-slate-700 dark:hover:text-slate-300">About</Link>
          <Link to="/login" className="hover:text-slate-700 dark:hover:text-slate-300">Sign In</Link>
          <Link to="/signup" className="hover:text-slate-700 dark:hover:text-slate-300">Sign Up</Link>
        </div>
      </footer>
    </div>
  );
};

export default About;
