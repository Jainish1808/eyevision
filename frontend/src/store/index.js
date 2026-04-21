import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (loading) => set({ isLoading: loading }),
  logout: () => set({ user: null, isAuthenticated: false }),
}))

export const useCartStore = create((set) => ({
  items: [],
  total: 0,
  itemCount: 0,

  addItem: (item) => set((state) => ({
    items: [...state.items, item],
    itemCount: state.itemCount + 1,
    total: state.total + item.price * item.quantity
  })),

  removeItem: (itemId) => set((state) => {
    const item = state.items.find(i => i.id === itemId)
    return {
      items: state.items.filter(i => i.id !== itemId),
      itemCount: state.itemCount - 1,
      total: state.total - (item?.price * item?.quantity || 0)
    }
  }),

  clearCart: () => set({ items: [], total: 0, itemCount: 0 }),
}))

export const useWishlistStore = create((set) => ({
  items: [],

  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  })),

  removeItem: (itemId) => set((state) => ({
    items: state.items.filter(i => i.id !== itemId)
  })),

  clearWishlist: () => set({ items: [] }),
}))
