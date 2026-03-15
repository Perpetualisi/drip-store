import { create } from "zustand"

interface WishlistStore {
  items: number[]
  addItem: (id: number) => void
  removeItem: (id: number) => void
  toggleItem: (id: number) => void
  isWishlisted: (id: number) => boolean
  count: () => number
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],

  addItem: (id) => {
    if (!get().items.includes(id)) {
      set((state) => ({ items: [...state.items, id] }))
    }
  },

  removeItem: (id) => {
    set((state) => ({ items: state.items.filter((i) => i !== id) }))
  },

  toggleItem: (id) => {
    const items = get().items
    if (items.includes(id)) {
      set({ items: items.filter((i) => i !== id) })
    } else {
      set({ items: [...items, id] })
    }
  },

  isWishlisted: (id) => get().items.includes(id),

  count: () => get().items.length,
}))