// API configuration
const config = {
  // Use environment variables with fallback to localhost for development
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
};

export default config;