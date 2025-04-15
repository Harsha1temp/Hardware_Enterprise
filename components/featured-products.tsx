"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/hooks/use-cart"
import type { Product } from "@/lib/types"

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products/featured")
        if (!response.ok) {
          throw new Error("Failed to fetch featured products")
        }
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error("Error fetching featured products:", error)
        toast({
          title: "Error",
          description: "Failed to load featured products",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [toast])

  const handleAddToCart = (product: Product) => {
    addToCart(product)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    })
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
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
    )
  }

  // Fallback to demo products if none are returned from API
  const displayProducts =
    products.length > 0
      ? products
      : [
          {
            id: "1",
            name: "Industrial Fastener Set",
            description: "High-quality steel fasteners for industrial use",
            price: 29.99,
            image: "/placeholder.svg?height=200&width=300",
          },
          {
            id: "2",
            name: "Precision Bearings",
            description: "Low-friction bearings for mechanical applications",
            price: 49.99,
            image: "/placeholder.svg?height=200&width=300",
          },
          {
            id: "3",
            name: "Heavy-Duty Hinges",
            description: "Durable hinges for industrial doors and equipment",
            price: 34.99,
            image: "/placeholder.svg?height=200&width=300",
          },
          {
            id: "4",
            name: "Pneumatic Valve Kit",
            description: "Complete valve kit for pneumatic systems",
            price: 79.99,
            image: "/placeholder.svg?height=200&width=300",
          },
        ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {displayProducts.map((product) => (
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
  )
}

