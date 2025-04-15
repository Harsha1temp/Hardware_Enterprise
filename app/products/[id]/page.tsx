import type { Metadata } from "next"
import ProductDetail from "@/components/product-detail"
import { getProductById } from "@/lib/products"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await getProductById(params.id)

  return {
    title: `${product?.name || "Product"} | Hardware Enterprise`,
    description: product?.description || "Product details",
  }
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-12">
      <ProductDetail id={params.id} />
    </div>
  )
}

