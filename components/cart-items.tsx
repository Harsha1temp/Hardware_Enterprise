"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { Trash2, Minus, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function CartItems() {
  const { items, updateQuantity, removeFromCart } = useCart()
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({})

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setIsUpdating((prev) => ({ ...prev, [id]: true }))

    try {
      updateQuantity(id, newQuantity)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      })
    } finally {
      setIsUpdating((prev) => ({ ...prev, [id]: false }))
    }
  }

  const handleRemoveItem = async (id: string) => {
    setIsUpdating((prev) => ({ ...prev, [id]: true }))

    try {
      removeFromCart(id)
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      })
    } finally {
      setIsUpdating((prev) => ({ ...prev, [id]: false }))
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
        <Button asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className={`border rounded-lg p-4 flex items-center ${isUpdating[item.id] ? "opacity-60" : ""}`}
        >
          <div className="relative h-20 w-20 rounded overflow-hidden mr-4">
            <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
          </div>
          <div className="flex-grow">
            <Link href={`/products/${item.id}`} className="font-semibold hover:text-primary">
              {item.name}
            </Link>
            <p className="text-gray-600 text-sm">${item.price.toFixed(2)}</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                disabled={isUpdating[item.id] || item.quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center text-sm">{item.quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                disabled={isUpdating[item.id]}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => handleRemoveItem(item.id)}
              disabled={isUpdating[item.id]}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove item</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

