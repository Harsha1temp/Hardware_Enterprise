import ProductForm from "../form"

export default function NewProductPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Add New Product</h1>
      <ProductForm />
    </div>
  )
}
