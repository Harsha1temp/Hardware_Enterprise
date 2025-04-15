"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/hooks/use-cart"
import type { Product } from "@/lib/types"
import { Search } from "lucide-react"

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products")
        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }
        const data = await response.json()
        setProducts(data)
        setFilteredProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive",
        })
        // Set demo products as fallback
        const demoProducts = generateDemoProducts()
        setProducts(demoProducts)
        setFilteredProducts(demoProducts)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [toast])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(products)
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredProducts(filtered)
    }
  }, [searchQuery, products])

  const handleAddToCart = (product: Product) => {
    addToCart(product)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    })
  }

  const generateDemoProducts = (): Product[] => {
    return [
      {
        id: "1",
        name: "Industrial Fastener Set",
        description: "High-quality steel fasteners for industrial use",
        price: 29.99,
        image: "/placeholder.svg?height=200&width=300",
        category: "fasteners",
      },
      {
        id: "2",
        name: "Precision Bearings",
        description: "Low-friction bearings for mechanical applications",
        price: 49.99,
        image: "/placeholder.svg?height=200&width=300",
        category: "bearings",
      },
      {
        id: "3",
        name: "Heavy-Duty Hinges",
        description: "Durable hinges for industrial doors and equipment",
        price: 34.99,
        image: "/placeholder.svg?height=200&width=300",
        category: "hinges",
      },
      {
        id: "4",
        name: "Pneumatic Valve Kit",
        description: "Complete valve kit for pneumatic systems",
        price: 79.99,
        image: "/placeholder.svg?height=200&width=300",
        category: "pneumatics",
      },
      {
        id: "5",
        name: "Stainless Steel Bolts",
        description: "Corrosion-resistant bolts for outdoor applications",
        price: 19.99,
        image: "/placeholder.svg?height=200&width=300",
        category: "fasteners",
      },
      {
        id: "6",
        name: "Linear Actuator",
        description: "Electric linear actuator for automation projects",
        price: 129.99,
        image: "/placeholder.svg?height=200&width=300",
        category: "automation",
      },
      {
        id: "7",
        name: "Hydraulic Cylinder",
        description: "Heavy-duty hydraulic cylinder for industrial machinery",
        price: 199.99,
        image: "/placeholder.svg?height=200&width=300",
        category: "hydraulics",
      },
      {
        id: "8",
        name: "Gear Set",
        description: "Precision-machined gears for mechanical power transmission",
        price: 89.99,
        image: "/placeholder.svg?height=200&width=300",
        category: "gears",
      },
    ]
  }

  if (isLoading) {
    return (
      <div>
        <div className="mb-6 relative">
          <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 relative">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No products found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden flex flex-col h-full">
              <div className="relative h-48">
                <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
              </div>
              <CardContent className="p-4 flex-grow">
                <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                <p className="font-bold text-lg">${product.price.toFixed(2)}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href={`/products/${product.id}`}>View Details</Link>
                </Button>
                <Button size="sm" className="flex-1" onClick={() => handleAddToCart(product)}>
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

