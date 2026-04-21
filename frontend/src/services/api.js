import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add request interceptor to include auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('auth_token')
      window.location.href = '/auth'
    }
    return Promise.reject(error)
  }
)

// Product endpoints
export const productAPI = {
  getAll: (params) => apiClient.get('/products', { params }),
  getById: (id) => apiClient.get(`/products/${id}`),
  getTrending: (limit = 8) => apiClient.get('/products/trending', { params: { limit } }),
  getNewArrivals: (limit = 8) => apiClient.get('/products/new-arrivals', { params: { limit } }),
  getRelated: (id, limit = 8) => apiClient.get(`/products/${id}/related`, { params: { limit } }),
  search: (query) => apiClient.get('/products/search', { params: { q: query } }),
  getCategories: () => apiClient.get('/products/categories'),
}

// Cart endpoints
export const cartAPI = {
  get: () => apiClient.get('/cart'),
  add: (productId, quantity, extra = {}) => apiClient.post('/cart/items', { productId, quantity, ...extra }),
  remove: (itemId) => apiClient.delete(`/cart/items/${itemId}`),
  update: (itemId, quantity) => apiClient.patch(`/cart/items/${itemId}`, { quantity }),
  clear: () => apiClient.delete('/cart'),
}

// Wishlist endpoints
export const wishlistAPI = {
  get: () => apiClient.get('/wishlist'),
  add: (productId) => apiClient.post('/wishlist', { productId }),
  remove: (productId) => apiClient.delete(`/wishlist/${productId}`),
}

// Order endpoints
export const orderAPI = {
  create: (data) => apiClient.post('/orders', data),
  getAll: () => apiClient.get('/orders'),
  getById: (id) => apiClient.get(`/orders/${id}`),
  cancel: (id) => apiClient.patch(`/orders/${id}/cancel`),
}

// User endpoints
export const userAPI = {
  getProfile: () => apiClient.get('/users/me'),
  updateProfile: (data) => apiClient.patch('/users/me', data),
  changePassword: (data) => apiClient.post('/users/change-password', data),
}

// Auth endpoints
export const authAPI = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  register: (data) => apiClient.post('/auth/register', data),
  sendOTP: (email) => apiClient.post('/auth/send-otp', { email }),
  logout: () => {
    localStorage.removeItem('auth_token')
    return Promise.resolve()
  },
  verifyOTP: (email, otp) => apiClient.post('/auth/verify-otp', { email, otp }),
}

export default apiClient
