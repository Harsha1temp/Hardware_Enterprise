import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // In a real app, this would connect to MongoDB
    // const { db } = await connectToDatabase();
    // const product = await db.collection('products').findOne({ id });

    // For demo purposes, we'll return mock data
    const products = [
      {
        id: "1",
        name: "Industrial Fastener Set",
        description:
          "High-quality steel fasteners for industrial use. This comprehensive set includes various sizes of bolts, nuts, and washers suitable for heavy-duty applications.",
        price: 29.99,
        image: "/placeholder.svg?height=400&width=600",
        category: "fasteners",
        specifications: {
          material: "Stainless Steel",
          dimensions: "10 x 8 x 4 inches",
          weight: "5 lbs",
          warranty: "1 year",
        },
        stock: 15,
      },
      {
        id: "2",
        name: "Precision Bearings",
        description:
          "Low-friction bearings for mechanical applications. Engineered for smooth operation and long life in high-precision machinery and equipment.",
        price: 49.99,
        image: "/placeholder.svg?height=400&width=600",
        category: "bearings",
        specifications: {
          material: "Chrome Steel",
          dimensions: "2 x 2 x 1 inches",
          weight: "0.5 lbs",
          warranty: "2 years",
        },
        stock: 8,
      },
      // Add more products as needed
    ]

    const product = products.find((p) => p.id === id)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

