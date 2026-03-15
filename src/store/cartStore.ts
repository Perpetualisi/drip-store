import { create } from "zustand"

export interface CartItem {
  id: number
  name: string
  price: number
  color: string
  secondaryColor: string
  type: string
  gender: string
  quantity: number
  size: string
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (id: number, size: string) => void
  updateQuantity: (id: number, size: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  total: () => number
  count: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,

  addItem: (item) => {
    const existing = get().items.find(
      (i) => i.id === item.id && i.size === item.size
    )
    if (existing) {
      set((state) => ({
        items: state.items.map((i) =>
          i.id === item.id && i.size === item.size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ),
      }))
    } else {
      set((state) => ({ items: [...state.items, item] }))
    }
    set({ isOpen: true })
  },

  removeItem: (id, size) => {
    set((state) => ({
      items: state.items.filter((i) => !(i.id === id && i.size === size)),
    }))
  },

  updateQuantity: (id, size, quantity) => {
    if (quantity <= 0) {
      get().removeItem(id, size)
      return
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id && i.size === size ? { ...i, quantity } : i
      ),
    }))
  },

  clearCart: () => set({ items: [] }),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  total: () =>
    get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

  count: () =>
    get().items.reduce((sum, i) => sum + i.quantity, 0),
}))