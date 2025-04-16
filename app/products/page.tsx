// app/products/page.tsx (Updated with useSearchParams)
'use client';

import { Suspense, useEffect, useState } from "react";
// --- Import useSearchParams ---
import { useSearchParams } from 'next/navigation';
// --- End Import ---
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Filter, Grid3X3, List, SlidersHorizontal, ShoppingCart } from "lucide-react";
import ProductsLoading from "./loading";
import ProductFilters from "@/components/product-filters";
import { useCart } from "@/lib/hooks/use-cart";
import { useToast } from "@/components/ui/use-toast";
import type { IProduct } from "@/models/Product";

// --- Remove searchParams from component props ---
export default function ProductsPage(/* { searchParams } */) {
// --- End Remove ---

  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();
  const { toast } = useToast();

  // --- Get searchParams using the hook ---
  const searchParams = useSearchParams();
  const category = searchParams.get('category') ?? undefined; // Use .get() and provide default
  const searchTerm = searchParams.get('search') ?? undefined; // Use .get()
  // --- End Get ---

  // Fetch products based on extracted params
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const query = new URLSearchParams();
        // Use the extracted variables here
        if (category) query.set('category', category);
        if (searchTerm) query.set('search', searchTerm);
        // Add other filters if needed

        console.log(`Fetching /api/products?${query.toString()}`); // Log the actual fetch URL
        const response = await fetch(`/api/products?${query.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Error",
          description: "Could not load products.",
          variant: "destructive",
        });
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
    // --- Update dependencies ---
  }, [category, searchTerm, toast]); // Depend on the extracted values
  // --- End Update ---


  // Filtering logic might not be needed here anymore if API does it all
  const filteredProducts = products;

  // handleAddToCart remains the same
  const handleAddToCart = (product: IProduct) => {
    addItem({
      id: product._id.toString(),
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      quantity: 1,
    });
    toast({
      title: "Added to Cart",
      description: `${product.name} added to your cart.`,
    });
  };

  // --- Rest of the component JSX remains the same ---
  // --- It uses filteredProducts which now comes directly from the state updated by useEffect ---
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header section */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Browse our collection of quality hardware products</p>
        </div>
         <div className="flex items-center gap-2">
            {/* Filter/Sort buttons can be implemented later */}
         </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        {/* Filters */}
        <div className="hidden md:block">
          <ProductFilters /> {/* This component might navigate, updating searchParams */}
        </div>
        {/* Products Grid */}
        <div>
          {isLoading ? (
              <ProductsLoading />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.length === 0 ? (
                 <p>No products found matching your criteria.</p>
              ) : (
                filteredProducts.map((product) => (
                  <Card key={product._id.toString()} className="overflow-hidden">
                    <div className="relative aspect-square">
                      <Image
                        src={product.imageUrl || "/Impact_Roller.jpg"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={false} // Avoid multiple priority images if possible
                      />
                    </div>
                    <CardContent className="p-4">
                       <div className="space-y-1">
                         <h3 className="font-semibold">{product.name}</h3>
                         {/* Optional vendor display */}
                       </div>
                       <div className="mt-2 flex items-center justify-between">
                         <span className="font-medium text-orange-600">₹{product.price.toLocaleString()}</span>
                         <span className="text-sm text-muted-foreground">{product.stock} in stock</span>
                       </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <div className="flex w-full gap-2">
                        <Button asChild variant="outline" className="w-full">
                          <Link href={`/products/${product._id.toString()}`}>View Details</Link>
                        </Button>
                        <Button
                          className="w-full bg-orange-600 hover:bg-orange-700"
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock <= 0}
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Add to Cart
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
           )}
        </div>
      </div>
    </div>
  );
}