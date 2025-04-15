"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function CartSummary() {
  const { items, totalPrice } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [shippingCost, setShippingCost] = useState(0)
  const [discount, setDiscount] = useState(0)

  useEffect(() => {
    // Calculate shipping based on total price
    if (totalPrice > 100) {
      setShippingCost(0) // Free shipping over $100
    } else {
      setShippingCost(10)
    }

    // Apply discount if applicable
    if (totalPrice > 200) {
      setDiscount(totalPrice * 0.05) // 5% discount over $200
    } else {
      setDiscount(0)
    }
  }, [totalPrice])

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to proceed to checkout",
      })
      router.push("/login?redirect=checkout")
      return
    }

    if (items.length === 0) {
      toast({
        title: "Empty cart",
        description: "Your cart is empty. Add some products before checkout.",
        variant: "destructive",
      })
      return
    }

    router.push("/checkout")
  }

  const grandTotal = totalPrice + shippingCost - discount

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span>Subtotal ({items.length} items)</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          {shippingCost === 0 ? <span className="text-green-600">Free</span> : <span>${shippingCost.toFixed(2)}</span>}
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount (5%)</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
        <div className="border-t pt-4 flex justify-between font-bold">
          <span>Grand Total</span>
          <span>${grandTotal.toFixed(2)}</span>
        </div>
        {totalPrice < 100 && (
          <div className="text-sm text-gray-600 mt-2">
            Add ${(100 - totalPrice).toFixed(2)} more to qualify for free shipping
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleCheckout} disabled={items.length === 0}>
          Proceed to Checkout
        </Button>
      </CardFooter>
    </Card>
  )
}

