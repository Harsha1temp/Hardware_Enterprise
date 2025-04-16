// app/cart/checkout/page.tsx (Corrected Code)
"use client"

import type React from "react"
import { useState, useEffect } from "react" // Added useEffect
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/hooks/use-auth" // Assuming you need user info
import { useCart } from "@/lib/hooks/use-cart"   // --- Import useCart ---
import { Loader2 } from "lucide-react"

export default function CheckoutPage() {
  const { user, isLoading: isAuthLoading } = useAuth() // Get user, rename loading state
  // --- Use Cart Context ---
  const { items: cartItems, subtotal, shipping, total, clearCart } = useCart(); // Get cart state
  // --- End Use Cart Context ---

  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // --- Remove Mock Cart Data ---
  // const cartItems = [ ... ]; // REMOVE THIS
  // const subtotal = ...; // REMOVE THIS (comes from useCart)
  // const shipping = ...; // REMOVE THIS (comes from useCart)
  // const total = ...;    // REMOVE THIS (comes from useCart)
  // --- End Remove Mock Cart Data ---

  const [formData, setFormData] = useState({
    name: "", // Initialize empty, then populate from user
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "cash", // Default to cash
    notes: "",
  });

  // Populate form with user data once auth is loaded and user exists
  useEffect(() => {
      if (user) {
          setFormData((prev) => ({
              ...prev,
              name: user.name || prev.name, // Keep existing if user.name is null/undefined
              email: user.email || prev.email,
              // You might need to fetch full user details if address/phone aren't in auth context
              // address: user.address || prev.address
              // phone: user.phone || prev.phone
          }));
      }
  }, [user]); // Run when user object changes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, paymentMethod: value }))
  }

  // --- Updated handleSubmit to send real data ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        toast({ title: "Error", description: "You must be logged in to place an order.", variant: "destructive" });
        router.push('/login?redirect=/cart/checkout'); // Redirect to login
        return;
    }
    if (cartItems.length === 0) {
         toast({ title: "Error", description: "Your cart is empty.", variant: "destructive" });
         return;
    }

    setIsSubmitting(true);

    // Prepare order data
    const orderData = {
      userId: user._id, // Assuming user object has _id
      items: cartItems.map(item => ({ // Map cart items to order item structure
          product: item.id, // Send product ID
          name: item.name,
          price: item.price,
          quantity: item.quantity
      })),
      totalAmount: total,
      shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
      customer: { // Add customer details
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
      },
      paymentMethod: formData.paymentMethod,
      notes: formData.notes,
      status: 'Pending' // Initial status
    };

    console.log("Submitting Order:", orderData); // Log before sending

    try {
      const response = await fetch('/api/orders', { // Assuming this is your orders endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
          const errorData = await response.json().catch(()=>({})); // Try to get error details
          throw new Error(errorData.message || `Failed to place order (status: ${response.status})`);
      }

      // Order placed successfully
      toast({
        title: "Order placed successfully!",
        description: "Your order # will be processed soon.", // Maybe include order ID from response later
      });

      clearCart(); // Clear the cart from context/localStorage
      router.push("/orders"); // Redirect to user's order history page

    } catch (error: any) {
        console.error("Order submission error:", error);
        toast({
            title: "Order Failed",
            description: error.message || "Could not place your order. Please try again.",
            variant: "destructive",
        });
    } finally {
      setIsSubmitting(false);
    }
  }
  // --- End Updated handleSubmit ---


  if (isAuthLoading) { // Check auth loading state
    return (
      <div className="container mx-auto flex min-h-[400px] items-center justify-center px-4 py-8">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    )
  }

  // --- If not logged in after loading, redirect (or show message) ---
   if (!user && !isAuthLoading) {
       // Optional: Show message instead of immediate redirect from useEffect
       return (
         <div className="container mx-auto px-4 py-8 text-center">
           <p className="mb-4">Please log in to proceed to checkout.</p>
           <Button asChild><Link href="/login?redirect=/cart/checkout">Login</Link></Button>
         </div>
       )
   }
   // --- End not logged in check ---

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

      {/* Prevent checkout if cart is empty */}
      {cartItems.length === 0 ? (
          <Card>
              <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground mb-4">Your cart is empty.</p>
                  <Button asChild variant="outline">
                      <Link href="/products">Continue Shopping</Link>
                  </Button>
              </CardContent>
          </Card>
      ) : (
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card>
              {/* Shipping Information CardHeader and CardContent remain the same, using formData */}
               <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
                {/* <CardDescription>Enter your shipping details</CardDescription> */}
              </CardHeader>
              <CardContent className="space-y-6">
                 {/* Name, Email, Phone, Address, City, State, Pincode Inputs */}
                 {/* Use formData state and handleChange */}
                 <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2"> <Label htmlFor="name">Full Name</Label> <Input id="name" name="name" value={formData.name} onChange={handleChange} required /> </div>
                    <div className="space-y-2"> <Label htmlFor="email">Email</Label> <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required /> </div>
                </div>
                <div className="space-y-2"> <Label htmlFor="phone">Phone Number</Label> <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required /> </div>
                <div className="space-y-2"> <Label htmlFor="address">Address</Label> <Textarea id="address" name="address" value={formData.address} onChange={handleChange} required rows={3}/> </div>
                 <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2"> <Label htmlFor="city">City</Label> <Input id="city" name="city" value={formData.city} onChange={handleChange} required /> </div>
                    <div className="space-y-2"> <Label htmlFor="state">State</Label> <Input id="state" name="state" value={formData.state} onChange={handleChange} required /> </div>
                    <div className="space-y-2"> <Label htmlFor="pincode">PIN Code</Label> <Input id="pincode" name="pincode" value={formData.pincode} onChange={handleChange} required /> </div>
                </div>
              </CardContent>

              <Separator />

              {/* Payment Method CardHeader and CardContent remain the same */}
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={formData.paymentMethod} onValueChange={handleRadioChange} className="space-y-3">
                  <div className="flex items-center space-x-2 rounded-md border p-3">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex-1 cursor-pointer">
                      Cash on Delivery
                    </Label>
                  </div>
                   {/* Add other payment methods here if needed */}
                </RadioGroup>
                 <div className="mt-6 space-y-2">
                  <Label htmlFor="notes">Order Notes (Optional)</Label>
                  <Textarea id="notes" name="notes" placeholder="Any special instructions..." value={formData.notes} onChange={handleChange} rows={3}/>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href="/cart">Back to Cart</Link>
                </Button>
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={isSubmitting || cartItems.length === 0}>
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                  ) : ( "Place Order" )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>

        {/* Order Summary Section */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               {/* --- Use cartItems from useCart() here --- */}
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              {/* --- End Use cartItems from useCart() --- */}

              <Separator />

               {/* --- Use subtotal, shipping, total from useCart() --- */}
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `₹${shipping.toLocaleString()}`}</span>
              </div>

              <Separator />

              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
               {/* --- End Use subtotal, shipping, total --- */}
            </CardContent>
          </Card>
        </div>
      </div>
      )} {/* End of conditional rendering based on cart empty */}
    </div>
  )
}