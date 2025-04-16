"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react"
import { useCart } from "@/lib/hooks/use-cart"

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, shipping, total } = useCart()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Your Cart</h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-dashed p-12 text-center">
          <ShoppingCart className="h-12 w-12 text-gray-400" />
          <h2 className="text-xl font-semibold">Your cart is empty</h2>
          <p className="text-muted-foreground">Looks like you haven't added any products to your cart yet.</p>
          <Button asChild className="mt-4 bg-orange-600 hover:bg-orange-700">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-lg border shadow-sm">
              <div className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Shopping Cart</h2>
                <div className="divide-y">
                  {items.map((item) => (
                    <div key={item.id} className="py-6 first:pt-0 last:pb-0">
                      <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium">{item.name}</h3>
                              <p className="mt-1 text-sm text-muted-foreground">
                                Unit Price: ₹{item.price.toLocaleString()}
                              </p>
                            </div>
                            <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center rounded-md border">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                                <span className="sr-only">Decrease quantity</span>
                              </Button>
                              <span className="w-8 text-center text-sm">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                                <span className="sr-only">Increase quantity</span>
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-lg border shadow-sm">
              <div className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>

                  <div className="pt-4">
                    <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
                      <Link href="/cart/checkout">Proceed to Checkout</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-lg border p-6 shadow-sm">
              <h3 className="mb-4 font-medium">Have a coupon?</h3>
              <div className="flex space-x-2">
                <Input placeholder="Enter coupon code" />
                <Button variant="outline">Apply</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
