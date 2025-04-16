// app/admin/orders/page.tsx (New File)
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import type { IOrder } from '@/models/Order'; // Import type

// Define the possible order statuses matching your schema
const ORDER_STATUSES: IOrder['status'][] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null); // Track which order ID is updating
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Function to fetch all orders (admin endpoint)
  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("AdminOrdersPage: Fetching all orders...");
      const response = await fetch('/api/orders'); // Admin GET fetches all
      console.log("AdminOrdersPage: Fetch response status:", response.status);
      if (!response.ok) {
         // Attempt to get error message from response body
         let errorMsg = 'Failed to fetch orders';
         try {
            const errData = await response.json();
            errorMsg = errData.message || errorMsg;
         } catch (_) {}
         throw new Error(`${errorMsg} (status: ${response.status})`);
      }
      const data = await response.json();
      console.log("AdminOrdersPage: Fetched orders data:", data);
      // Make sure user data is populated if needed, otherwise expect ObjectId
      setOrders(data.orders || []);
    } catch (fetchError: any) {
      console.error("Error fetching admin orders:", fetchError);
      setError(fetchError.message || "Could not load orders.");
      toast({ title: "Error", description: fetchError.message || "Could not load orders.", variant: "destructive" });
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch orders on initial load
  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to handle status update
  const handleStatusChange = async (orderId: string, newStatus: IOrder['status']) => {
      if (!orderId || !newStatus) return;
      setIsUpdating(orderId);
      try {
          const response = await fetch(`/api/orders/${orderId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: newStatus }),
          });

          if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(errorData.message || 'Failed to update status');
          }

          const updatedData = await response.json(); // Get the updated order back

          // Update local state with the full updated order from the response
          setOrders(prevOrders =>
              prevOrders.map(order =>
                  order._id.toString() === orderId ? updatedData.order : order
              )
          );

          toast({
              title: "Status Updated",
              description: `Order #${orderId.slice(-8)} status set to ${newStatus}.`,
          });

      } catch (updateError: any) {
          console.error("Error updating order status:", updateError);
          toast({
              title: "Update Failed",
              description: updateError.message || "Could not update order status.",
              variant: "destructive",
          });
      } finally {
          setIsUpdating(null); // Clear loading state for this order
      }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Orders</h1>
        {/* Add Filter/Search Controls Here Later */}
      </div>

      {error && <p className="text-red-600 mb-4">Error loading orders: {error}</p>}

      <Card>
        <CardHeader>
          <CardTitle>All Customer Orders</CardTitle>
          <CardDescription>View and update order statuses.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
             <div className="flex justify-center items-center p-10">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
             </div>
          ) : orders.length === 0 ? (
              <p className="text-center text-muted-foreground p-10">No orders found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead className="w-[180px]">Status</TableHead>
                    {/* <TableHead className="text-right">Actions</TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id.toString()}>
                      <TableCell className="font-mono text-xs">#{order._id.toString().slice(-8)}</TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      {/* Display customer name/email - check if 'user' is populated */}
                      <TableCell className="text-sm">
                         {(order.user as any)?.name || (order.user as any)?.email || order.user?.toString() || 'N/A'}
                      </TableCell>
                      <TableCell>₹{order.totalAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-sm">{order.items.length}</TableCell>
                      <TableCell>
                          <div className="flex items-center gap-2">
                              <Select
                                  value={order.status}
                                  onValueChange={(newStatus) => handleStatusChange(order._id.toString(), newStatus as IOrder['status'])}
                                  disabled={isUpdating === order._id.toString()}
                              >
                                <SelectTrigger className="w-full h-8 text-xs">
                                  <SelectValue placeholder="Set Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  {ORDER_STATUSES.map((status) => (
                                    <SelectItem key={status} value={status} className="text-xs">
                                      {status}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {isUpdating === order._id.toString() && <Loader2 className="h-4 w-4 animate-spin" />}
                          </div>
                      </TableCell>
                       {/* Optional: Add View button if you create a detailed order view page */}
                       {/* <TableCell className="text-right"> ... </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}