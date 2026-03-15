export type ProductType = "hoodie" | "dress" | "jacket" | "pants" | "coat" | "shorts" | "tee" | "skirt"
export type Gender = "Male" | "Female"

export interface Product {
  id: number
  name: string
  price: number
  category: string
  tag: string
  color: string
  secondaryColor: string
  type: ProductType
  gender: Gender
  description: string
}

export const products: Product[] = [
  { id: 1,  name: "Obsidian Hoodie",  price: 120, category: "Tops",      tag: "Bestseller", color: "#1a1a1a", secondaryColor: "#c8a96e", type: "hoodie",  gender: "Male",   description: "Premium heavyweight cotton blend" },
  { id: 2,  name: "Arctic Hoodie",    price: 135, category: "Tops",      tag: "New",        color: "#e8e8e8", secondaryColor: "#888888", type: "hoodie",  gender: "Male",   description: "Clean white oversized silhouette" },
  { id: 3,  name: "Crimson Hoodie",   price: 125, category: "Tops",      tag: "Limited",    color: "#8B1A1A", secondaryColor: "#c8a96e", type: "hoodie",  gender: "Male",   description: "Bold red statement piece" },
  { id: 4,  name: "Forest Hoodie",    price: 115, category: "Tops",      tag: "New",        color: "#2D4A2D", secondaryColor: "#4a7a4a", type: "hoodie",  gender: "Male",   description: "Deep forest green essential" },
  { id: 5,  name: "Void Jacket",      price: 280, category: "Outerwear", tag: "New",        color: "#0f0f0f", secondaryColor: "#c8a96e", type: "jacket",  gender: "Male",   description: "Structured matte black jacket" },
  { id: 6,  name: "Cobalt Jacket",    price: 295, category: "Outerwear", tag: "Limited",    color: "#1B3A6B", secondaryColor: "#4a7abf", type: "jacket",  gender: "Male",   description: "Deep navy premium jacket" },
  { id: 7,  name: "Camel Coat",       price: 380, category: "Outerwear", tag: "Bestseller", color: "#C19A6B", secondaryColor: "#8B6914", type: "coat",    gender: "Male",   description: "Classic camel overcoat" },
  { id: 8,  name: "Charcoal Coat",    price: 360, category: "Outerwear", tag: "New",        color: "#3a3a3a", secondaryColor: "#666666", type: "coat",    gender: "Male",   description: "Tailored charcoal wool blend" },
  { id: 9,  name: "Phantom Pants",    price: 160, category: "Bottoms",   tag: "New",        color: "#1a1a1a", secondaryColor: "#444444", type: "pants",   gender: "Male",   description: "Slim fit technical trousers" },
  { id: 10, name: "Stone Pants",      price: 145, category: "Bottoms",   tag: "Bestseller", color: "#8C8070", secondaryColor: "#c8b89a", type: "pants",   gender: "Male",   description: "Relaxed stone wash trousers" },
  { id: 11, name: "Indigo Pants",     price: 155, category: "Bottoms",   tag: "Limited",    color: "#2B3A6B", secondaryColor: "#4a5a9a", type: "pants",   gender: "Male",   description: "Rich indigo slim fit" },
  { id: 12, name: "Olive Pants",      price: 150, category: "Bottoms",   tag: "New",        color: "#4A5240", secondaryColor: "#6a7260", type: "pants",   gender: "Male",   description: "Military olive cargo" },
  { id: 13, name: "Onyx Tee",         price: 75,  category: "Tops",      tag: "Bestseller", color: "#111111", secondaryColor: "#333333", type: "tee",     gender: "Male",   description: "Essential heavyweight tee" },
  { id: 14, name: "Bone Tee",         price: 70,  category: "Tops",      tag: "New",        color: "#E8E0D0", secondaryColor: "#c8b89a", type: "tee",     gender: "Male",   description: "Vintage washed bone white" },
  { id: 15, name: "Rust Tee",         price: 80,  category: "Tops",      tag: "Limited",    color: "#8B3A1A", secondaryColor: "#c86030", type: "tee",     gender: "Male",   description: "Faded rust oversized tee" },
  { id: 16, name: "Slate Shorts",     price: 95,  category: "Bottoms",   tag: "New",        color: "#4A5568", secondaryColor: "#718096", type: "shorts",  gender: "Male",   description: "Relaxed slate swim shorts" },
  { id: 17, name: "Sand Shorts",      price: 90,  category: "Bottoms",   tag: "Bestseller", color: "#C2A882", secondaryColor: "#8B6914", type: "shorts",  gender: "Male",   description: "Premium sand linen shorts" },
  { id: 18, name: "Midnight Jacket",  price: 310, category: "Outerwear", tag: "Limited",    color: "#1a1a2e", secondaryColor: "#c8a96e", type: "jacket",  gender: "Male",   description: "Midnight blue bomber" },
  { id: 19, name: "Burgundy Coat",    price: 395, category: "Outerwear", tag: "New",        color: "#5C1A2A", secondaryColor: "#8B2A3A", type: "coat",    gender: "Male",   description: "Rich burgundy statement coat" },
  { id: 20, name: "Cream Hoodie",     price: 130, category: "Tops",      tag: "Bestseller", color: "#F5F0E8", secondaryColor: "#c8a96e", type: "hoodie",  gender: "Male",   description: "Soft cream relaxed fit" },
  { id: 21, name: "Noir Mini Dress",  price: 185, category: "Dresses",   tag: "Bestseller", color: "#0f0f0f", secondaryColor: "#c8a96e", type: "dress",   gender: "Female", description: "Sleek minimalist mini dress" },
  { id: 22, name: "Blush Midi Dress", price: 210, category: "Dresses",   tag: "New",        color: "#E8B4A0", secondaryColor: "#c87060", type: "dress",   gender: "Female", description: "Flowing blush midi silhouette" },
  { id: 23, name: "Ivory Maxi Dress", price: 245, category: "Dresses",   tag: "Limited",    color: "#F5F0E8", secondaryColor: "#c8a96e", type: "dress",   gender: "Female", description: "Elegant ivory maxi dress" },
  { id: 24, name: "Cobalt Dress",     price: 220, category: "Dresses",   tag: "New",        color: "#1B3A6B", secondaryColor: "#4a7abf", type: "dress",   gender: "Female", description: "Bold cobalt evening dress" },
  { id: 25, name: "Forest Coat",      price: 420, category: "Outerwear", tag: "Limited",    color: "#2D4A2D", secondaryColor: "#4a7a4a", type: "coat",    gender: "Female", description: "Dramatic forest green coat" },
  { id: 26, name: "Blush Coat",       price: 395, category: "Outerwear", tag: "Bestseller", color: "#D4A0A0", secondaryColor: "#c87060", type: "coat",    gender: "Female", description: "Soft blush oversized coat" },
  { id: 27, name: "Caramel Jacket",   price: 285, category: "Outerwear", tag: "New",        color: "#C19A6B", secondaryColor: "#8B6914", type: "jacket",  gender: "Female", description: "Fitted caramel leather jacket" },
  { id: 28, name: "Onyx Jacket",      price: 300, category: "Outerwear", tag: "Limited",    color: "#1a1a1a", secondaryColor: "#c8a96e", type: "jacket",  gender: "Female", description: "Structured onyx blazer" },
  { id: 29, name: "Mauve Skirt",      price: 125, category: "Bottoms",   tag: "New",        color: "#9B7B8B", secondaryColor: "#c8a0b0", type: "skirt",   gender: "Female", description: "Flowing mauve midi skirt" },
  { id: 30, name: "Cream Skirt",      price: 115, category: "Bottoms",   tag: "Bestseller", color: "#F5F0E8", secondaryColor: "#c8a96e", type: "skirt",   gender: "Female", description: "Minimalist cream A-line skirt" },
  { id: 31, name: "Onyx Skirt",       price: 130, category: "Bottoms",   tag: "Limited",    color: "#1a1a1a", secondaryColor: "#444444", type: "skirt",   gender: "Female", description: "Sleek onyx pencil skirt" },
  { id: 32, name: "Terracotta Skirt", price: 120, category: "Bottoms",   tag: "New",        color: "#C4622D", secondaryColor: "#8B3A1A", type: "skirt",   gender: "Female", description: "Earthy terracotta wrap skirt" },
  { id: 33, name: "Rose Hoodie",      price: 140, category: "Tops",      tag: "Bestseller", color: "#C4788A", secondaryColor: "#8B3A4A", type: "hoodie",  gender: "Female", description: "Cropped rose oversized hoodie" },
  { id: 34, name: "Sage Hoodie",      price: 135, category: "Tops",      tag: "New",        color: "#7A9B7A", secondaryColor: "#4a6a4a", type: "hoodie",  gender: "Female", description: "Soft sage green crop hoodie" },
  { id: 35, name: "Lavender Dress",   price: 195, category: "Dresses",   tag: "Limited",    color: "#9B8EC4", secondaryColor: "#6a5a9a", type: "dress",   gender: "Female", description: "Dreamy lavender slip dress" },
  { id: 36, name: "Mocha Dress",      price: 205, category: "Dresses",   tag: "New",        color: "#6B4A3A", secondaryColor: "#8B6050", type: "dress",   gender: "Female", description: "Rich mocha bodycon dress" },
  { id: 37, name: "Champagne Coat",   price: 440, category: "Outerwear", tag: "Limited",    color: "#C8B89A", secondaryColor: "#8B7850", type: "coat",    gender: "Female", description: "Luxe champagne statement coat" },
  { id: 38, name: "Slate Pants",      price: 145, category: "Bottoms",   tag: "Bestseller", color: "#4A5568", secondaryColor: "#718096", type: "pants",   gender: "Female", description: "High waist slate wide leg" },
  { id: 39, name: "Burgundy Dress",   price: 230, category: "Dresses",   tag: "New",        color: "#5C1A2A", secondaryColor: "#8B2A3A", type: "dress",   gender: "Female", description: "Dramatic burgundy gown" },
  { id: 40, name: "Pearl Jacket",     price: 275, category: "Outerwear", tag: "Bestseller", color: "#E8E0D0", secondaryColor: "#c8a96e", type: "jacket",  gender: "Female", description: "Elegant pearl white blazer" },
]