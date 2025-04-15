import type { Metadata } from "next"
import ProductList from "@/components/product-list"
import ProductFilters from "@/components/product-filters"

export const metadata: Metadata = {
  title: "Products | Hardware Enterprise",
  description: "Browse our wide range of hardware products",
}

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <ProductFilters />
        </div>
        <div className="lg:col-span-3">
          <ProductList />
        </div>
      </div>
    </div>
  )
}

