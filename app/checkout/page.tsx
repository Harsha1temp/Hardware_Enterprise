import type { Metadata } from "next"
import CheckoutForm from "@/components/checkout-form"
import OrderSummary from "@/components/order-summary"

export const metadata: Metadata = {
  title: "Checkout | Hardware Enterprise",
  description: "Complete your order",
}

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CheckoutForm />
        </div>
        <div className="lg:col-span-1">
          <OrderSummary />
        </div>
      </div>
    </div>
  )
}

