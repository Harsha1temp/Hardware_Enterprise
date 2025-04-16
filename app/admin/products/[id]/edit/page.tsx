import ProductForm from "../../form"

export default function EditProductPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Edit Product</h1>
      <ProductForm productId={params.id} />
    </div>
  )
}
