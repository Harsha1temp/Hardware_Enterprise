// "use client"

// import { useState } from "react"
// import Image from "next/image"
// import Link from "next/link"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Separator } from "@/components/ui/separator"
// import { useToast } from "@/components/ui/use-toast"
// import { ChevronLeft, Minus, Plus, ShoppingCart, Star, Truck } from "lucide-react"
// import { useCart } from "@/lib/hooks/use-cart"

// // This would normally fetch from your database
// async function getProduct(id: string) {
//   // In a real app, this would be an API call
//   // For now, we'll use mock data
//   const products = [
//     {
//       id: "1",
//       name: "Power Drill Set",
//       price: 4999,
//       category: "tools",
//       image: "/placeholder.svg?height=600&width=600&text=Power+Drill",
//       stock: 25,
//       vendor: "ToolMaster",
//       description:
//         "Professional-grade power drill set with multiple attachments and carrying case. Features a powerful motor, variable speed control, and ergonomic grip for comfortable use. Includes drill bits, screwdriver bits, and a durable carrying case.",
//       features: [
//         "Powerful 850W motor",
//         "Variable speed control",
//         "Ergonomic grip",
//         "Includes 15 drill bits",
//         "Carrying case included",
//       ],
//       specifications: {
//         Power: "850W",
//         Speed: "0-3000 RPM",
//         "Chuck Size": "13mm",
//         Weight: "1.8kg",
//         Warranty: "2 years",
//       },
//     },
//     {
//       id: "2",
//       name: "Stainless Steel Fasteners Kit",
//       price: 1299,
//       category: "fasteners",
//       image: "/placeholder.svg?height=600&width=600&text=Fasteners",
//       stock: 100,
//       vendor: "MetalPro",
//       description:
//         "Complete kit of stainless steel screws, nuts, and bolts in various sizes. Perfect for construction, DIY projects, and repairs. Made from high-quality stainless steel for durability and corrosion resistance.",
//       features: [
//         "Stainless steel construction",
//         "Corrosion resistant",
//         "Multiple sizes included",
//         "Organized storage case",
//         "1000+ pieces",
//       ],
//       specifications: {
//         Material: "304 Stainless Steel",
//         Pieces: "1000+",
//         Sizes: "M3-M10",
//         Weight: "2.5kg",
//         Storage: "Compartmentalized case",
//       },
//     },
//   ]

//   const product = products.find((p) => p.id === id)
//   return product
// }

// export default function ProductPage({ params }: { params: { id: string } }) {
//   const [quantity, setQuantity] = useState(1)
//   const { addItem } = useCart()
//   const { toast } = useToast()
//   const router = useRouter()

//   // In a real app, this would be a server component or use SWR/React Query
//   const [product, setProduct] = useState<any>(null)
//   const [loading, setLoading] = useState(true)

//   // Fetch product data
//   useState(() => {
//     const fetchProduct = async () => {
//       try {
//         const data = await getProduct(params.id)
//         setProduct(data)
//       } catch (error) {
//         console.error("Error fetching product:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchProduct()
//   })

//   if (loading) {
//     return <div>Loading...</div>
//   }

//   if (!product) {
//     return <div>Product not found</div>
//   }

//   const decreaseQuantity = () => {
//     if (quantity > 1) {
//       setQuantity(quantity - 1)
//     }
//   }

//   const increaseQuantity = () => {
//     if (quantity < product.stock) {
//       setQuantity(quantity + 1)
//     }
//   }

//   const handleAddToCart = () => {
//     addItem({
//       id: product.id,
//       name: product.name,
//       price: product.price,
//       image: product.image,
//       quantity: quantity,
//     })

//     toast({
//       title: "Added to cart",
//       description: `${quantity} × ${product.name} has been added to your cart.`,
//     })
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="mb-6">
//         <Button variant="ghost" asChild className="mb-4">
//           <Link href="/products">
//             <ChevronLeft className="mr-2 h-4 w-4" />
//             Back to Products
//           </Link>
//         </Button>
//       </div>

//       <div className="grid gap-8 md:grid-cols-2">
//         {/* Product Image */}
//         <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
//           <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" priority />
//         </div>

//         {/* Product Details */}
//         <div className="flex flex-col space-y-6">
//           <div>
//             <h1 className="text-3xl font-bold">{product.name}</h1>
//             <div className="mt-2 flex items-center gap-4">
//               <div className="flex items-center">
//                 {Array(5)
//                   .fill(0)
//                   .map((_, i) => (
//                     <Star key={i} className="h-5 w-5 fill-current text-yellow-400" />
//                   ))}
//                 <span className="ml-2 text-sm text-gray-600">(24 reviews)</span>
//               </div>
//               <span className="text-sm text-gray-600">Vendor: {product.vendor}</span>
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             <div className="text-3xl font-bold text-orange-600">₹{product.price.toLocaleString()}</div>
//             {product.stock > 0 ? (
//               <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
//                 In Stock ({product.stock} available)
//               </span>
//             ) : (
//               <span className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-800">Out of Stock</span>
//             )}
//           </div>

//           <Separator />

//           <div>
//             <h3 className="mb-2 text-lg font-semibold">Description</h3>
//             <p className="text-gray-700">{product.description}</p>
//           </div>

//           {product.features && (
//             <div>
//               <h3 className="mb-2 text-lg font-semibold">Key Features</h3>
//               <ul className="list-inside list-disc space-y-1">
//                 {product.features.map((feature: string, index: number) => (
//                   <li key={index} className="text-gray-700">
//                     {feature}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           <Separator />

//           <div className="flex items-center gap-4">
//             <div className="flex items-center rounded-md border">
//               <Button variant="ghost" size="icon" className="h-10 w-10" onClick={decreaseQuantity}>
//                 <Minus className="h-4 w-4" />
//                 <span className="sr-only">Decrease quantity</span>
//               </Button>
//               <span className="w-12 text-center">{quantity}</span>
//               <Button variant="ghost" size="icon" className="h-10 w-10" onClick={increaseQuantity}>
//                 <Plus className="h-4 w-4" />
//                 <span className="sr-only">Increase quantity</span>
//               </Button>
//             </div>
//             <Button className="flex-1 bg-orange-600 hover:bg-orange-700" onClick={handleAddToCart}>
//               <ShoppingCart className="mr-2 h-5 w-5" />
//               Add to Cart
//             </Button>
//           </div>

//           <div className="rounded-md bg-gray-50 p-4">
//             <div className="flex items-center gap-3">
//               <Truck className="h-5 w-5 text-orange-600" />
//               <span className="text-sm font-medium">Free delivery on orders over ₹1000</span>
//             </div>
//           </div>

//           {product.specifications && (
//             <div>
//               <h3 className="mb-2 text-lg font-semibold">Specifications</h3>
//               <div className="rounded-md border">
//                 {Object.entries(product.specifications).map(
//                   ([key, value]: [string, string], index: number, arr: any[]) => (
//                     <div key={key} className={`flex ${index !== arr.length - 1 ? "border-b" : ""}`}>
//                       <div className="w-1/3 bg-gray-50 p-3 font-medium">{key}</div>
//                       <div className="w-2/3 p-3">{value}</div>
//                     </div>
//                   ),
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }
// app/products/[id]/page.tsx (Updated to fetch single product)
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { ChevronLeft, Minus, Plus, ShoppingCart, Star, Truck } from "lucide-react"
import { useCart } from "@/lib/hooks/use-cart"
import type { IProduct } from "@/models/Product"; // Ensure correct path

export default function ProductPage({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const { toast } = useToast()

  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params.id) {
        setError("Product ID is missing.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/products/${params.id}`); // Fetch from API
        if (response.status === 404) {
            throw new Error("Product not found");
        }
        if (!response.ok) {
          throw new Error(`Failed to fetch product (status: ${response.status})`);
        }
        const data = await response.json();
        if (!data.product) { // Check if product data exists in response
            throw new Error("Product data not found in API response");
        }
        setProduct(data.product);
      } catch (fetchError: any) {
        console.error("Error fetching product:", fetchError);
        setError(fetchError.message || "Could not load product details.");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading product details...</div>
  }

  if (error) {
     return <div className="container mx-auto px-4 py-8 text-center text-red-600">Error: {error}</div>
  }

  // Ensure product is not null before proceeding
  if (!product) {
    return <div className="container mx-auto px-4 py-8 text-center">Product not found.</div>
  }

  const decreaseQuantity = () => {
    setQuantity((q) => Math.max(1, q - 1));
  }

  const increaseQuantity = () => {
    setQuantity((q) => Math.min(product.stock, q + 1));
  }

  const handleAddToCart = () => {
    if (!product) return; // Guard just in case

    addItem({
      id: product._id.toString(), // Use MongoDB _id
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      quantity: quantity,
    })

    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} has been added to your cart.`,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
       <div className="mb-6">
         <Button variant="ghost" asChild className="mb-4">
           <Link href="/products">
             <ChevronLeft className="mr-2 h-4 w-4" />
             Back to Products
           </Link>
         </Button>
       </div>
        {/* Rest of the JSX rendering using 'product' state */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            <Image src={product.imageUrl || "/placeholder.svg"} alt={product.name} fill className="object-cover" priority />
          </div>

          {/* Product Details */}
          <div className="flex flex-col space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <div className="mt-2 flex items-center gap-4">
                {/* Static stars for now */}
                <div className="flex items-center">
                  {Array(5).fill(0).map((_, i) => ( <Star key={i} className="h-5 w-5 fill-current text-yellow-400" /> ))}
                </div>
                {/* <span className="text-sm text-gray-600">Vendor: {product.vendor}</span> */}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold text-orange-600">₹{product.price.toLocaleString()}</div>
              {product.stock > 0 ? (
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
                  In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-800">Out of Stock</span>
              )}
            </div>

            <Separator />

            <div>
              <h3 className="mb-2 text-lg font-semibold">Description</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>

            {/* Optional: Add Features/Specifications display if in schema */}

            <Separator />

             <div className="flex items-center gap-4">
                <div className="flex items-center rounded-md border">
                    <Button variant="ghost" size="icon" className="h-10 w-10" onClick={decreaseQuantity}>
                    <Minus className="h-4 w-4" />
                    <span className="sr-only">Decrease quantity</span>
                    </Button>
                    <span className="w-12 text-center">{quantity}</span>
                    <Button variant="ghost" size="icon" className="h-10 w-10" onClick={increaseQuantity} disabled={quantity >= product.stock}>
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Increase quantity</span>
                    </Button>
                </div>
                <Button
                    className="flex-1 bg-orange-600 hover:bg-orange-700"
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                </Button>
             </div>

            <div className="rounded-md bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium">Free delivery on orders over ₹1000</span>
              </div>
            </div>

          </div>
        </div>
    </div>
  )
}