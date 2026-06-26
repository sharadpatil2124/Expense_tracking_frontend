import React, { createContext, useState, useCallback, useContext } from 'react';
import apiClient from '../api/apiClient';
import { AuthContext } from './AuthContext';

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10
  });

  const [filters, setFiltersState] = useState({
    search: '',
    type: '',
    category: '',
    startDate: '',
    endDate: '',
    sort: 'newest',
    page: 1,
    limit: 10
  });

  const [summary, setSummary] = useState({
    allTime: { totalIncome: 0, totalExpense: 0, balance: 0, savingsRate: 0 },
    currentMonth: { income: 0, expense: 0, balance: 0 },
    budget: { limit: 0, alertEnabled: false, isExceeded: false, spentPercentage: 0 }
  });

  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);

  // Fetch transactions based on filter settings
  const fetchTransactions = useCallback(async (customFilters = {}) => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const activeFilters = { ...filters, ...customFilters };
      // Map filters to query params
      const params = {};
      if (activeFilters.search) params.search = activeFilters.search;
      if (activeFilters.type) params.type = activeFilters.type;
      if (activeFilters.category) params.category = activeFilters.category;
      if (activeFilters.startDate) params.startDate = activeFilters.startDate;
      if (activeFilters.endDate) params.endDate = activeFilters.endDate;
      if (activeFilters.sort) params.sort = activeFilters.sort;
      if (activeFilters.page) params.page = activeFilters.page;
      if (activeFilters.limit) params.limit = activeFilters.limit;

      const res = await apiClient.get('/transactions', { params });
      if (res.data && res.data.success) {
        setTransactions(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, isAuthenticated]);

  // Update specific filters and trigger search
  const updateFilters = useCallback((newFilters) => {
    setFiltersState((prev) => {
      const updated = { ...prev, ...newFilters };
      // If we are changing filters that aren't page, reset page back to 1
      if (!newFilters.hasOwnProperty('page')) {
        updated.page = 1;
      }
      return updated;
    });
  }, []);

  // Fetch financial summary
  const fetchSummary = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await apiClient.get('/reports/summary');
      if (res.data && res.data.success) {
        setSummary(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  }, [isAuthenticated]);

  // Fetch monthly trends
  const fetchMonthlyTrends = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await apiClient.get('/reports/monthly');
      if (res.data && res.data.success) {
        setMonthlyTrends(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching monthly trends:', error);
    }
  }, [isAuthenticated]);

  // Fetch category analytics
  const fetchCategoryBreakdown = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await apiClient.get('/reports/categories');
      if (res.data && res.data.success) {
        setCategoryBreakdown(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching category breakdown:', error);
    }
  }, [isAuthenticated]);

  // Refresh all dashboard metrics in single call
  const refreshDashboardData = useCallback(() => {
    fetchSummary();
    fetchMonthlyTrends();
    fetchCategoryBreakdown();
  }, [fetchSummary, fetchMonthlyTrends, fetchCategoryBreakdown]);

  // Add a new transaction
  const addTransaction = async (transactionData) => {
    try {
      const res = await apiClient.post('/transactions', transactionData);
      if (res.data && res.data.success) {
        // Refresh transaction list and summaries
        fetchTransactions();
        refreshDashboardData();
        return { success: true };
      }
    } catch (error) {
      const errMsg = error.response?.data?.error || 'Failed to add transaction.';
      return { success: false, error: errMsg };
    }
  };

  // Edit a transaction
  const editTransaction = async (id, transactionData) => {
    try {
      const res = await apiClient.put(`/transactions/${id}`, transactionData);
      if (res.data && res.data.success) {
        fetchTransactions();
        refreshDashboardData();
        return { success: true };
      }
    } catch (error) {
      const errMsg = error.response?.data?.error || 'Failed to update transaction.';
      return { success: false, error: errMsg };
    }
  };

  // Delete a transaction
  const deleteTransaction = async (id) => {
    try {
      const res = await apiClient.delete(`/transactions/${id}`);
      if (res.data && res.data.success) {
        fetchTransactions();
        refreshDashboardData();
        return { success: true };
      }
    } catch (error) {
      const errMsg = error.response?.data?.error || 'Failed to delete transaction.';
      return { success: false, error: errMsg };
    }
  };

  // Set / Update monthly budget limit
  const updateBudget = async (budgetLimit, alertEnabled = true) => {
    try {
      const res = await apiClient.put('/reports/budget', {
        monthlyLimit: budgetLimit,
        alertEnabled
      });
      if (res.data && res.data.success) {
        refreshDashboardData();
        return { success: true };
      }
    } catch (error) {
      const errMsg = error.response?.data?.error || 'Failed to update budget limit settings.';
      return { success: false, error: errMsg };
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        loading,
        pagination,
        filters,
        summary,
        monthlyTrends,
        categoryBreakdown,
        fetchTransactions,
        updateFilters,
        fetchSummary,
        fetchMonthlyTrends,
        fetchCategoryBreakdown,
        refreshDashboardData,
        addTransaction,
        editTransaction,
        deleteTransaction,
        updateBudget
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
