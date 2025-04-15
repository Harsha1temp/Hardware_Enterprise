"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/hooks/use-cart"
import type { Product } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Minus, Plus, ShoppingCart } from "lucide-react"

export default function ProductDetail({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const { toast } = useToast()
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch product")
        }
        const data = await response.json()
        setProduct(data)
      } catch (error) {
        console.error("Error fetching product:", error)
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        })
        // Set demo product as fallback
        setProduct({
          id,
          name: "Industrial Fastener Set",
          description:
            "High-quality steel fasteners for industrial use. This comprehensive set includes various sizes of bolts, nuts, and washers suitable for heavy-duty applications.",
          price: 29.99,
          image: "/placeholder.svg?height=400&width=600",
          category: "fasteners",
          specifications: {
            material: "Stainless Steel",
            dimensions: "10 x 8 x 4 inches",
            weight: "5 lbs",
            warranty: "1 year",
          },
          stock: 15,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [id, toast])

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product)
      }
      toast({
        title: "Added to cart",
        description: `${quantity} ${quantity === 1 ? "item" : "items"} added to your cart`,
      })
    }
  }

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
        <div className="h-[400px] bg-gray-200 rounded-lg"></div>
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          <div className="h-12 bg-gray-200 rounded w-full mt-8"></div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
        <p className="text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" priority />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>

          <div className="flex items-center mb-6">
            <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
            {product.stock && product.stock > 0 ? (
              <span className="ml-4 px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="ml-4 px-2 py-1 bg-red-100 text-red-800 text-sm rounded-full">Out of Stock</span>
            )}
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center border rounded-md">
              <Button variant="ghost" size="icon" onClick={decrementQuantity} disabled={quantity <= 1}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={incrementQuantity}
                disabled={product.stock && quantity >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={handleAddToCart} disabled={!product.stock || product.stock <= 0} className="flex-1">
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
          </div>

          {product.specifications && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-2">Quick Specifications</h3>
              <ul className="space-y-1">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <li key={key} className="flex">
                    <span className="font-medium w-32 capitalize">{key}:</span>
                    <span>{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Product Details</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="p-4 border rounded-md">
          <h3 className="text-xl font-semibold mb-4">Product Details</h3>
          <p className="text-gray-700">
            {product.description}
            {/* Extended description would go here */}
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed euismod, nisl vel ultricies
            lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies
            lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2">
            <li>High-quality materials for durability</li>
            <li>Precision engineered for optimal performance</li>
            <li>Compatible with standard industry equipment</li>
            <li>Tested for reliability in demanding environments</li>
          </ul>
        </TabsContent>
        <TabsContent value="specifications" className="p-4 border rounded-md">
          <h3 className="text-xl font-semibold mb-4">Technical Specifications</h3>
          <table className="w-full border-collapse">
            <tbody>
              {product.specifications &&
                Object.entries(product.specifications).map(([key, value]) => (
                  <tr key={key} className="border-b">
                    <td className="py-2 font-medium capitalize w-1/3">{key}</td>
                    <td className="py-2">{value}</td>
                  </tr>
                ))}
              <tr className="border-b">
                <td className="py-2 font-medium w-1/3">Package Contents</td>
                <td className="py-2">1 x {product.name}, Installation Manual, Warranty Card</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium w-1/3">Country of Origin</td>
                <td className="py-2">USA</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium w-1/3">Certification</td>
                <td className="py-2">ISO 9001, CE</td>
              </tr>
            </tbody>
          </table>
        </TabsContent>
        <TabsContent value="shipping" className="p-4 border rounded-md">
          <h3 className="text-xl font-semibold mb-4">Shipping & Returns</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-lg">Shipping</h4>
              <p className="text-gray-700">
                We offer standard shipping (3-5 business days) and express shipping (1-2 business days) options.
                Shipping costs are calculated at checkout based on your location and the weight of your order.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-lg">Returns</h4>
              <p className="text-gray-700">
                If you're not completely satisfied with your purchase, you can return it within 30 days for a full
                refund or exchange. Please note that items must be in their original condition and packaging.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-lg">Warranty</h4>
              <p className="text-gray-700">
                This product comes with a 1-year manufacturer's warranty against defects in materials and workmanship
                under normal use.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

