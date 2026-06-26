import axios from 'axios';

let apiBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

if (apiBaseURL) {
  apiBaseURL = apiBaseURL.replace(/\/$/, '');
  if (!apiBaseURL.endsWith('/api/v1')) {
    apiBaseURL = apiBaseURL + '/api/v1';
  }
}

const apiClient = axios.create({
  baseURL: apiBaseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});


// Interceptor to attach the token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Global response interceptor for session expiration handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized (invalid token, token expired), auto logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
