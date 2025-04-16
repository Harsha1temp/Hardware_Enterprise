// app/admin/page.tsx (Updated to show Product List in Tab)
"use client"

import { useEffect, useState, useCallback } from "react" // Added useCallback
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/hooks/use-auth"
import { Loader2, BarChart3, Box, DollarSign, ListOrdered, Package, ShoppingCart, Users, PackagePlus, Edit, Trash2 } from "lucide-react" // Added more icons
import { useToast } from "@/components/ui/use-toast"
import type { IOrder } from "@/models/Order";
import type { IProduct } from "@/models/Product";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminDashboard() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // State for fetched data
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]); // For product tab list
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
  });
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [productsError, setProductsError] = useState<string | null>(null); // Specific error state for products tab

  // --- Function to fetch products (moved here) ---
  const fetchProducts = useCallback(async () => {
    // Only fetch if the products tab might be viewed or for stats
    // We can refine this later if needed
    setIsLoadingData(true); // Indicate loading specifically for product data if needed
    setProductsError(null);
    try {
      console.log("AdminDashboard: Fetching products for tab...");
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error(`Failed to fetch products (status: ${response.status})`);
      }
      const data = await response.json();
      setProducts(data.products || []);
      console.log("AdminDashboard: Products fetched successfully.");
    } catch (fetchError: any) {
      console.error("Error fetching products for tab:", fetchError);
      setProductsError(fetchError.message || "Could not load products.");
      setProducts([]); // Clear products on error
    } finally {
       // Consider setting a separate loading state for products if needed
      // setIsLoadingData(false); // This might conflict with other data loading
    }
    // Add toast dependency if you show toast messages here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Function to fetch Overview data ---
   const fetchOverviewData = useCallback(async () => {
      setIsLoadingData(true);
      let fetchError = false;
      try {
        // Fetch Orders (Only if needed for overview stats/list)
        const ordersRes = await fetch('/api/orders');
        if (!ordersRes.ok) throw new Error('Failed to fetch orders');
        const ordersData = await ordersRes.json();
        const fetchedOrders = ordersData.orders || [];
        setOrders(fetchedOrders); // Update orders state

        // Fetch Products (if not already fetched or needed for overview stats)
        // We might already have products from fetchProducts, depends on flow
        // If not needed for overview stats, this can be removed
        const productsRes = await fetch('/api/products');
        if (!productsRes.ok) throw new Error('Failed to fetch products');
        const productsData = await productsRes.json();
        const fetchedProducts = productsData.products || [];
        // setProducts(fetchedProducts); // Update products state if not done elsewhere

        // Calculate Stats
        const totalRevenue = fetchedOrders.reduce((sum: number, order: IOrder) => sum + order.totalAmount, 0);
        const totalOrders = fetchedOrders.length;
        const totalProducts = fetchedProducts.length;

        setStats({
            totalRevenue,
            totalOrders,
            totalProducts,
            totalCustomers: 0, // Placeholder
        });

      } catch (error) {
        fetchError = true;
        console.error("Error fetching admin dashboard overview data:", error);
        toast({
          title: "Error Loading Overview Data",
          description: "Could not load dashboard overview data.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingData(false); // Overview data loading finished
      }
      // Add toast dependency
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // --- Initial Data Fetch Hook ---
  useEffect(() => {
    // Fetch data only when authenticated as admin
    if (!isAuthLoading && user?.role === 'admin') {
        // Fetch data needed for the initial view (overview)
        fetchOverviewData();
        // Also fetch products initially if the product tab might be default or needed for overview
        fetchProducts();
    } else if (!isAuthLoading && user?.role !== 'admin') {
        // Handle case where user is somehow here but not admin
        setIsLoadingData(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthLoading, user, fetchOverviewData, fetchProducts]); // Add fetch functions to deps

  // --- Admin Access Control ---
  const isLoading = isAuthLoading || isLoadingData;

  useEffect(() => {
    if (!isAuthLoading && (!user || user.role !== 'admin')) {
      console.log("Admin Dashboard: Redirecting non-admin user.");
      router.push("/");
    }
  }, [user, isAuthLoading, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-[400px] items-center justify-center px-4 py-8">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        <span className="ml-2">Loading Admin Data...</span>
      </div>
    );
  }

  if (!user?.role || user.role !== 'admin') {
     return (
       <div className="container mx-auto px-4 py-8 text-center">
         <p className="text-red-600">Access Denied. You must be an administrator.</p>
         <Button onClick={() => router.push('/')} variant="link">Go Home</Button>
       </div>
     );
  }
  // --- End Admin Access Control ---

  // --- Function to handle product deletion (moved here) ---
  const handleDeleteProduct = async (productId: string) => {
    console.log(`Attempting to delete product ID: ${productId}`);
    // Optionally set a specific loading state for the delete button
    try {
        const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE',
        });
         console.log(`DELETE /api/products/${productId} response status: ${response.status}`);

        if (!response.ok) {
            const data = await response.json().catch(() => ({ message: 'Failed to delete product and parse error response.' }));
            throw new Error(data.message || `Failed to delete product (status: ${response.status})`);
        }

        toast({
            title: "Success",
            description: "Product deleted successfully."
        });
        // Refetch products list after deletion
        fetchProducts(); // Call the fetch function defined above

    } catch (deleteError: any) {
        console.error("Error deleting product:", deleteError);
        toast({
            title: "Error Deleting Product",
            description: deleteError.message || "Could not delete product.",
            variant: "destructive",
        });
    } finally {
        // Turn off specific delete loading state if used
    }
 };

  // --- Prepare data for rendering ---
  const lowStockThreshold = 10;
  const lowStockProducts = products.filter(p => p.stock <= lowStockThreshold).slice(0, 5);
  const recentOrders = orders.slice(0, 5);


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger> {/* Keep as trigger */}
          <TabsTrigger value="orders">Orders</TabsTrigger> {/* Keep as trigger */}
          <TabsTrigger value="customers" disabled>Customers</TabsTrigger> {/* Keep disabled */}
        </TabsList>

        {/* --- Overview Tab Content (Remains largely the same, uses fetched stats) --- */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
             {/* Card 1: Total Revenue */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <h3 className="mt-1 text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</h3>
                  </div>
                  <div className="rounded-full bg-orange-100 p-3"> <DollarSign className="h-6 w-6 text-orange-600" /> </div>
                </div>
              </CardContent>
            </Card>
             {/* Card 2: Total Orders */}
             <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                    <h3 className="mt-1 text-2xl font-bold">{stats.totalOrders}</h3>
                  </div>
                  <div className="rounded-full bg-orange-100 p-3"> <ShoppingCart className="h-6 w-6 text-orange-600" /> </div>
                </div>
              </CardContent>
            </Card>
            {/* Card 3: Total Products */}
             <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                    <h3 className="mt-1 text-2xl font-bold">{stats.totalProducts}</h3>
                  </div>
                  <div className="rounded-full bg-orange-100 p-3"> <Package className="h-6 w-6 text-orange-600" /> </div>
                </div>
              </CardContent>
            </Card>
            {/* Card 4: Total Customers */}
             <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                    <h3 className="mt-1 text-2xl font-bold">{stats.totalCustomers}</h3>
                  </div>
                  <div className="rounded-full bg-orange-100 p-3"> <Users className="h-6 w-6 text-orange-600" /> </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sales Overview & Recent Orders Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Sales Overview Card (Placeholder) */}
            <Card>
              <CardHeader> <CardTitle>Sales Overview</CardTitle> <CardDescription>Monthly sales performance</CardDescription> </CardHeader>
              <CardContent> <div className="h-[300px] w-full"><div className="flex h-full items-center justify-center"><BarChart3 className="h-16 w-16 text-muted-foreground/50" /></div></div> </CardContent>
            </Card>

            {/* Recent Orders Card (Using fetched data) */}
            <Card>
              <CardHeader> <CardTitle>Recent Orders</CardTitle> <CardDescription>Latest {recentOrders.length} orders</CardDescription> </CardHeader>
              <CardContent>
                {isLoadingData && orders.length === 0 ? ( // Show loader specifically for this card if data is still loading
                    <div className="flex justify-center items-center p-4"><Loader2 className="h-6 w-6 animate-spin text-orange-500" /></div>
                ) : recentOrders.length === 0 ? (
                    <p className="text-center text-muted-foreground p-4">No recent orders found.</p>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order._id.toString()} className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <p className="font-medium">Order #{order._id.toString().slice(-6)}</p>
                          {/* Displaying user ID for now, population needed for name */}
                           <p className="text-sm text-muted-foreground">User: {order.user.toString()}</p>
                        </div>
                        <div className="text-right">
                          <p>₹{order.totalAmount.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-4 text-center">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/admin/orders">View All Orders</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Low Stock Products Card (Using fetched data) */}
          <Card>
            <CardHeader> <CardTitle>Low Stock Products</CardTitle> <CardDescription>Products with stock at or below {lowStockThreshold}</CardDescription> </CardHeader>
            <CardContent>
               {isLoadingData && products.length === 0 ? ( // Show loader specifically for this card
                   <div className="flex justify-center items-center p-4"><Loader2 className="h-6 w-6 animate-spin text-orange-500" /></div>
               ) : lowStockProducts.length === 0 ? (
                   <p className="text-center text-muted-foreground p-4">No products are currently low on stock.</p>
               ) : (
                  <div className="space-y-4">
                    {lowStockProducts.map((product) => (
                      <div key={product._id.toString()} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center gap-3">
                          <div className="rounded-md bg-orange-100 p-2"> <Box className="h-5 w-5 text-orange-600" /> </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                             <p className="text-sm text-muted-foreground">{product.vendor || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-red-500">{product.stock} in stock</p>
                        </div>
                      </div>
                    ))}
                  </div>
               )}
              <div className="mt-4 text-center">
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin/products">Manage Inventory</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* --- End Overview Tab --- */}


        {/* --- Products Tab Content (Now contains the list) --- */}
        <TabsContent value="products" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Product Management</h2>
            <Button asChild className="bg-orange-600 hover:bg-orange-700">
              <Link href="/admin/products/new">
                 <PackagePlus className="mr-2 h-4 w-4" />
                 Add New Product
               </Link>
            </Button>
          </div>

           {productsError && <p className="text-red-600 mb-4">Error loading products: {productsError}</p>}

          <Card>
             {/* Removed CardHeader/Title/Description, already have h2 above */}
            <CardContent className="p-0"> {/* Use p-0 if table handles padding */}
              {isLoadingData && products.length === 0 ? ( // Use same loading state for now
                 <div className="flex justify-center items-center p-10">
                    <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                 </div>
              ) : products.length === 0 && !productsError ? ( // Check for no error too
                  <p className="text-center text-muted-foreground p-10">No products found. Add one using the button above!</p>
              ) : !productsError ? ( // Only render table if no error
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product._id.toString()}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>₹{product.price.toLocaleString()}</TableCell>
                          <TableCell>{product.stock}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button asChild variant="outline" size="sm">
                                {/* Link to the edit page */}
                                <Link href={`/admin/products/edit/${product._id.toString()}`}>
                                  <Edit className="mr-1 h-3 w-3" /> Edit
                                </Link>
                              </Button>

                              {/* Delete Confirmation Dialog */}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300">
                                     <Trash2 className="mr-1 h-3 w-3" /> Delete
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the product
                                      "{product.name}".
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => handleDeleteProduct(product._id.toString())}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>

                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : null } {/* Don't render table if there was an error fetching products */}
            </CardContent>
          </Card>
        </TabsContent>
        {/* --- End Products Tab --- */}


        {/* --- Orders Tab Content (Placeholder - Link added in TabsTrigger) --- */}
        <TabsContent value="orders">
            <h2 className="text-xl font-semibold mb-4">Order Management</h2>
            <Card><CardContent className="p-6 text-center text-muted-foreground">Order management is handled on the <Link href="/admin/orders" className="text-orange-600 underline">Orders Page</Link>.</CardContent></Card>
        </TabsContent>
        {/* --- End Orders Tab --- */}


        {/* --- Customers Tab Content (Placeholder) --- */}
        <TabsContent value="customers">
            <h2 className="text-xl font-semibold mb-4">Customer Management</h2>
            <Card><CardContent className="p-6 text-center text-muted-foreground">Customer management not implemented yet.</CardContent></Card>
        </TabsContent>
        {/* --- End Customers Tab --- */}

      </Tabs>
    </div>
  )
}