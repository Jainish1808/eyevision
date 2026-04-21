import { create } from 'zustand'
import { authAPI, cartAPI, wishlistAPI } from '../services/api'

// Auth Store
export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  
  login: async (email, password) => {
    set({ isLoading: true })
    try {
      const response = await authAPI.login(email, password)
      const { token, user } = response.data
      localStorage.setItem('auth_token', token)
      set({ user, isAuthenticated: true, isLoading: false })
      return response.data
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  logout: async () => {
    try {
      await authAPI.logout()
    } finally {
      localStorage.removeItem('auth_token')
      set({ user: null, isAuthenticated: false })
    }
  },
  
  checkAuth: async () => {
    // Check if token exists and fetch user
    const token = localStorage.getItem('auth_token')
    if (token) {
        // Assume API call here
        set({ isAuthenticated: true, user: { name: 'User' } })
    }
  }
}))

// Cart Store
export const useCartStore = create((set, get) => ({
  items: [],
  isLoading: false,
  isCartOpen: false,

  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  
  fetchCart: async () => {
    set({ isLoading: true })
    try {
      const response = await cartAPI.get()
      set({ items: response.data.items, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
      console.error('Failed to fetch cart', error)
    }
  },

  addItem: async (productId, quantity = 1) => {
    try {
      // Optimistic update logic could go here
      const response = await cartAPI.add(productId, quantity)
      set({ items: response.data.items, isCartOpen: true })
    } catch (error) {
      console.error('Failed to add to cart', error)
    }
  },

  removeItem: async (itemId) => {
    try {
      await cartAPI.remove(itemId)
      set((state) => ({ items: state.items.filter(i => i.id !== itemId) }))
    } catch (error) {
       console.error('Failed to remove item', error)
    }
  },
  
  updateQuantity: async (itemId, quantity) => {
    try {
      await cartAPI.update(itemId, quantity)
      set((state) => ({
         items: state.items.map(i => i.id === itemId ? { ...i, quantity } : i)
      }))
    } catch (error) {
       console.error('Failed to update quantity', error)
    }
  }
}))

// Wishlist Store
export const useWishlistStore = create((set) => ({
  items: [],
  fetchWishlist: async () => {
    try {
      const response = await wishlistAPI.get()
      set({ items: response.data.items })
    } catch (error) {
      console.error('Failed to fetch wishlist', error)
    }
  },
  toggleItem: async (productId) => {
    // Stub
  }
}))
