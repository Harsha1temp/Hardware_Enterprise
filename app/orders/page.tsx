// app/orders/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from "@/components/ui/use-toast";
import { Loader2, PackageSearch } from 'lucide-react'; // Import icons
import { useAuth } from '@/lib/hooks/use-auth'; // To check login status
import type { IOrder } from '@/models/Order'; // Import type
import Image from 'next/image'; // For displaying product images


export default function MyOrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoading: isAuthLoading } = useAuth(); // Get user auth status
  const { toast } = useToast();

  useEffect(() => {
    // Only fetch if authentication is loaded and user is logged in
    if (!isAuthLoading && user) {
        const fetchOrders = async () => {
            setIsLoading(true);
            setError(null);
            try {
                console.log("MyOrdersPage: Fetching user orders...");
                const response = await fetch('/api/orders'); // API endpoint automatically filters by user
                console.log("MyOrdersPage: Fetch response status:", response.status);

                if (response.status === 401) { // Handle case where token might be invalid client-side
                   throw new Error("Authentication required. Please log in again.");
                }
                if (!response.ok) {
                   throw new Error(`Failed to fetch orders (status: ${response.status})`);
                }

                const data = await response.json();
                console.log("MyOrdersPage: Fetched orders data:", data);
                setOrders(data.orders || []);
            } catch (fetchError: any) {
                console.error("Error fetching user orders:", fetchError);
                setError(fetchError.message || "Could not load your orders.");
                toast({ title: "Error", description: fetchError.message || "Could not load your orders.", variant: "destructive" });
                setOrders([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    } else if (!isAuthLoading && !user) {
        // If auth check is done and there's no user, stop loading
        setIsLoading(false);
        setError("Please log in to view your orders."); // Set an error/message
    }
    // Dependency: re-fetch if auth status changes
  }, [user, isAuthLoading, toast]);

  // Display loading state
  if (isLoading || isAuthLoading) {
    return (
      <div className="container mx-auto flex min-h-[400px] items-center justify-center px-4 py-8">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        <span className="ml-2">Loading your orders...</span>
      </div>
    );
  }

   // Display error/login prompt if applicable
   if (error) {
     return (
       <div className="container mx-auto px-4 py-8 text-center">
         <p className="text-red-600 mb-4">{error}</p>
         {!user && <Button asChild><Link href="/login?redirect=/orders">Login</Link></Button>}
       </div>
     )
   }

  // Display orders or 'no orders' message
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
             <PackageSearch className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
             <p className="text-muted-foreground">You haven't placed any orders yet.</p>
             <Button asChild variant="link" className="mt-2 text-orange-600">
                <Link href="/products">Start Shopping</Link>
             </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order._id.toString()}>
              <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                 <div>
                    <CardTitle>Order #{order._id.toString().slice(-8)}</CardTitle> {/* Show partial ID */}
                    <CardDescription>
                        Placed on: {new Date(order.createdAt).toLocaleDateString()}
                    </CardDescription>
                 </div>
                 <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                     order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                     order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                     order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                     order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                     'bg-gray-100 text-gray-800' // Pending or other
                 }`}>
                    {order.status}
                 </span>
              </CardHeader>
              <CardContent>
                <Separator className="my-4" />
                <div className="space-y-3">
                    {order.items.map((item, index) => (
                       <div key={`${order._id.toString()}-${index}`} className="flex items-center gap-4">
                            {/* Optional: Display item image */}
                            {/* <Image src={(item.product as any)?.imageUrl || '/placeholder.svg'} alt={item.name} width={40} height={40} className="rounded" /> */}
                            <div className="flex-grow">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                            <p className="text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
                       </div>
                    ))}
                </div>
                 <Separator className="my-4" />
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                        <span>Shipping Address:</span>
                        <span>{order.shippingAddress}</span>
                    </div>
                     <div className="flex justify-between">
                        <span>Payment Method:</span>
                        <span>{order.paymentMethod}</span>
                    </div>
                 </div>
              </CardContent>
              <CardFooter className="flex justify-end font-semibold">
                <span>Total: ₹{order.totalAmount.toLocaleString()}</span>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}