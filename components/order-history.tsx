"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import type { Order } from "@/lib/types"
import { ChevronDown, ChevronUp, Package } from "lucide-react"

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({})
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch("/api/orders")
        if (!response.ok) {
          throw new Error("Failed to fetch orders")
        }
        const data = await response.json()
        setOrders(data)
      } catch (error) {
        console.error("Error fetching orders:", error)
        toast({
          title: "Error",
          description: "Failed to load your orders",
          variant: "destructive",
        })
        // Set demo orders as fallback
        setOrders(generateDemoOrders())
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [user, toast])

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const generateDemoOrders = (): Order[] => {
    return [
      {
        id: "ORD123456",
        date: "2023-04-15",
        total: 149.97,
        status: "Delivered",
        items: [
          {
            id: "1",
            name: "Industrial Fastener Set",
            price: 29.99,
            quantity: 2,
            image: "/placeholder.svg?height=80&width=80",
          },
          {
            id: "3",
            name: "Heavy-Duty Hinges",
            price: 34.99,
            quantity: 1,
            image: "/placeholder.svg?height=80&width=80",
          },
          {
            id: "5",
            name: "Stainless Steel Bolts",
            price: 19.99,
            quantity: 1,
            image: "/placeholder.svg?height=80&width=80",
          },
        ],
        shippingAddress: {
          name: "John Doe",
          address: "123 Main St",
          city: "Anytown",
          state: "CA",
          zipCode: "12345",
        },
      },
      {
        id: "ORD789012",
        date: "2023-03-28",
        total: 229.98,
        status: "Shipped",
        items: [
          {
            id: "2",
            name: "Precision Bearings",
            price: 49.99,
            quantity: 2,
            image: "/placeholder.svg?height=80&width=80",
          },
          {
            id: "4",
            name: "Pneumatic Valve Kit",
            price: 79.99,
            quantity: 1,
            image: "/placeholder.svg?height=80&width=80",
          },
          {
            id: "6",
            name: "Linear Actuator",
            price: 129.99,
            quantity: 1,
            image: "/placeholder.svg?height=80&width=80",
          },
        ],
        shippingAddress: {
          name: "John Doe",
          address: "123 Main St",
          city: "Anytown",
          state: "CA",
          zipCode: "12345",
        },
      },
    ]
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-2">Login Required</h2>
        <p className="text-gray-600 mb-6">Please login to view your order history.</p>
        <Button asChild>
          <Link href="/login?redirect=orders">Login</Link>
        </Button>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
        <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
        <Button asChild>
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader className="pb-2">
            <div className="flex flex-wrap justify-between items-start">
              <div>
                <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                <p className="text-sm text-gray-500">Placed on {new Date(order.date).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                <span className="font-semibold">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {order.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="h-10 w-10 rounded-full border-2 border-white overflow-hidden relative">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="h-10 w-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>
                <span className="ml-4 text-sm">
                  {order.items.length} {order.items.length === 1 ? "item" : "items"}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleOrderExpand(order.id)}
                className="flex items-center"
              >
                {expandedOrders[order.id] ? (
                  <>
                    <span>Show less</span>
                    <ChevronUp className="ml-1 h-4 w-4" />
                  </>
                ) : (
                  <>
                    <span>View details</span>
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>

            {expandedOrders[order.id] && (
              <div className="mt-4 border-t pt-4">
                <h4 className="font-medium mb-2">Order Items</h4>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center">
                      <div className="h-16 w-16 rounded overflow-hidden mr-4">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h5 className="font-medium">{item.name}</h5>
                        <p className="text-sm text-gray-600">
                          ${item.price.toFixed(2)} x {item.quantity}
                        </p>
                      </div>
                      <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">Shipping Address</h4>
                  <p className="text-sm">
                    {order.shippingAddress.name}
                    <br />
                    {order.shippingAddress.address}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

