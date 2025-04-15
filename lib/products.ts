import type { Product } from "@/types"

// This would be replaced with actual database queries in a real app
export async function getProducts(): Promise<Product[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return [
    {
      id: "1",
      name: "Industrial Fastener Set",
      description: "High-quality steel fasteners for industrial use",
      price: 29.99,
      image: "/placeholder.svg?height=200&width=300",
      category: "fasteners",
      specifications: {
        material: "Stainless Steel",
        dimensions: "10 x 8 x 4 inches",
        weight: "5 lbs",
        warranty: "1 year",
      },
      stock: 15,
    },
    {
      id: "2",
      name: "Precision Bearings",
      description: "Low-friction bearings for mechanical applications",
      price: 49.99,
      image: "/placeholder.svg?height=200&width=300",
      category: "bearings",
      specifications: {
        material: "Chrome Steel",
        dimensions: "2 x 2 x 1 inches",
        weight: "0.5 lbs",
        warranty: "2 years",
      },
      stock: 8,
    },
    // Add more products as needed
  ]
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts()
  return products.find((product) => product.id === id) || null
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getProducts()
  // In a real app, you might have a featured flag or use some other criteria
  return products.slice(0, 4)
}

