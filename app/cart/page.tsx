import type { Metadata } from "next"
import CartItems from "@/components/cart-items"
import CartSummary from "@/components/cart-summary"

export const metadata: Metadata = {
  title: "Shopping Cart | Hardware Enterprise",
  description: "View and manage your shopping cart",
}

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CartItems />
        </div>
        <div className="lg:col-span-1">
          <CartSummary />
        </div>
      </div>
    </div>
  )
}

