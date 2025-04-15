import type { Metadata } from "next"
import OrderHistory from "@/components/order-history"

export const metadata: Metadata = {
  title: "Your Orders | Hardware Enterprise",
  description: "View your order history",
}

export default function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
      <OrderHistory />
    </div>
  )
}

