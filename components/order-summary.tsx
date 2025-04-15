"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/hooks/use-cart"

export default function OrderSummary() {
  const { items, totalPrice } = useCart()
  const [shippingCost, setShippingCost] = useState(10)
  const [discount, setDiscount] = useState(0)
  const [tax, setTax] = useState(0)

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

    // Calculate tax (e.g., 7% sales tax)
    setTax(totalPrice * 0.07)
  }, [totalPrice])

  const grandTotal = totalPrice + shippingCost - discount + tax

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>
                {item.name} <span className="text-gray-500">x{item.quantity}</span>
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            {shippingCost === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              <span>${shippingCost.toFixed(2)}</span>
            )}
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount (5%)</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Tax (7%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
        </div>

        <div className="border-t pt-4 flex justify-between font-bold">
          <span>Grand Total</span>
          <span>${grandTotal.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  )
}

