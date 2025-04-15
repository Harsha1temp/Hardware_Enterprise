"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/hooks/use-cart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Truck, MapPin } from "lucide-react"

export default function CheckoutForm() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("razorpay")
  const [shippingMethod, setShippingMethod] = useState("standard")
  const router = useRouter()
  const { toast } = useToast()
  const { clearCart } = useCart()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // In a real app, this would call an API to process the order
      // and initialize Razorpay payment

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      if (paymentMethod === "razorpay") {
        // This would be replaced with actual Razorpay integration
        // For demo purposes, we'll just simulate a successful payment
        simulateRazorpayPayment()
      } else {
        // Process other payment methods
        processOrder()
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  const simulateRazorpayPayment = () => {
    // In a real implementation, this would open the Razorpay payment modal
    toast({
      title: "Razorpay Payment",
      description: "Simulating Razorpay payment process...",
    })

    // Simulate successful payment after 2 seconds
    setTimeout(() => {
      processOrder()
    }, 2000)
  }

  const processOrder = () => {
    // Clear the cart and redirect to success page
    clearCart()
    toast({
      title: "Order placed successfully",
      description: "Thank you for your purchase!",
    })
    router.push("/orders")
    setIsProcessing(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" /> Shipping Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input id="zipCode" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Order Notes (Optional)</Label>
              <Textarea id="notes" placeholder="Special instructions for delivery" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="mr-2 h-5 w-5" /> Shipping Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-3">
              <div className="flex items-center space-x-2 border p-3 rounded-md">
                <RadioGroupItem value="standard" id="standard" />
                <Label htmlFor="standard" className="flex-grow cursor-pointer">
                  <div className="font-medium">Standard Shipping</div>
                  <div className="text-sm text-gray-500">3-5 business days</div>
                </Label>
                <div className="font-medium">$10.00</div>
              </div>
              <div className="flex items-center space-x-2 border p-3 rounded-md">
                <RadioGroupItem value="express" id="express" />
                <Label htmlFor="express" className="flex-grow cursor-pointer">
                  <div className="font-medium">Express Shipping</div>
                  <div className="text-sm text-gray-500">1-2 business days</div>
                </Label>
                <div className="font-medium">$25.00</div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" /> Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="razorpay" onValueChange={setPaymentMethod}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="razorpay">Razorpay</TabsTrigger>
                <TabsTrigger value="credit-card">Credit Card</TabsTrigger>
                <TabsTrigger value="cod">Cash on Delivery</TabsTrigger>
              </TabsList>

              <TabsContent value="razorpay">
                <div className="p-4 border rounded-md">
                  <p className="text-sm text-gray-600 mb-4">
                    You will be redirected to Razorpay to complete your payment securely.
                  </p>
                  <div className="flex items-center justify-center">
                    <img src="/placeholder.svg?height=40&width=120" alt="Razorpay" className="h-10" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="credit-card">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input id="expiryDate" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nameOnCard">Name on Card</Label>
                    <Input id="nameOnCard" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="cod">
                <div className="p-4 border rounded-md">
                  <p className="text-sm text-gray-600">
                    Pay with cash upon delivery. Please note that cash on delivery is only available for orders under
                    $500.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Place Order"}
        </Button>
      </div>
    </form>
  )
}

