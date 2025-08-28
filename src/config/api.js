// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL 
  || (process.env.NODE_ENV === 'production' 
    ? null // Will use mock data if no backend URL is provided
    : 'http://localhost:5000');

// Helper function to check if we should use mock data
export const shouldUseMockData = () => {
  return process.env.NODE_ENV === 'production' && !process.env.REACT_APP_API_URL;
};

export default API_BASE_URL;

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL || 'http://localhost:5000'}/api/auth/login`,
  SIGNUP: `${API_BASE_URL || 'http://localhost:5000'}/api/auth/createuser`,
  FOOD_DATA: `${API_BASE_URL || 'http://localhost:5000'}/api/auth/foodData`,
  ORDER_DATA: `${API_BASE_URL || 'http://localhost:5000'}/api/auth/orderData`,
  MY_ORDER_DATA: `${API_BASE_URL || 'http://localhost:5000'}/api/auth/myOrderData`,
  GET_LOCATION: `${API_BASE_URL || 'http://localhost:5000'}/api/auth/getlocation`
};
