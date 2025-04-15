import { NextResponse } from "next/server"

export async function GET() {
  try {
    // In a real app, this would connect to MongoDB
    // const { db } = await connectToDatabase();
    // const products = await db.collection('products').find({ featured: true }).toArray();

    // For demo purposes, we'll return mock data
    const products = [
      {
        id: "1",
        name: "Industrial Fastener Set",
        description: "High-quality steel fasteners for industrial use",
        price: 29.99,
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "2",
        name: "Precision Bearings",
        description: "Low-friction bearings for mechanical applications",
        price: 49.99,
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "3",
        name: "Heavy-Duty Hinges",
        description: "Durable hinges for industrial doors and equipment",
        price: 34.99,
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "4",
        name: "Pneumatic Valve Kit",
        description: "Complete valve kit for pneumatic systems",
        price: 79.99,
        image: "/placeholder.svg?height=200&width=300",
      },
    ]

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return NextResponse.json({ error: "Failed to fetch featured products" }, { status: 500 })
  }
}

