import { NextResponse } from "next/server"

export async function GET() {
  try {
    // In a real app, this would connect to MongoDB
    // const { db } = await connectToDatabase();
    // const products = await db.collection('products').find({}).toArray();

    // For demo purposes, we'll return mock data
    const products = [
      {
        id: "1",
        name: "Industrial Fastener Set",
        description: "High-quality steel fasteners for industrial use",
        price: 29.99,
        image: "/placeholder.svg?height=200&width=300",
        category: "fasteners",
      },
      {
        id: "2",
        name: "Precision Bearings",
        description: "Low-friction bearings for mechanical applications",
        price: 49.99,
        image: "/placeholder.svg?height=200&width=300",
        category: "bearings",
      },
      {
        id: "3",
        name: "Heavy-Duty Hinges",
        description: "Durable hinges for industrial doors and equipment",
        price: 34.99,
        image: "/placeholder.svg?height=200&width=300",
        category: "hinges",
      },
      {
        id: "4",
        name: "Pneumatic Valve Kit",
        description: "Complete valve kit for pneumatic systems",
        price: 79.99,
        image: "/placeholder.svg?height=200&width=300",
        category: "pneumatics",
      },
      {
        id: "5",
        name: "Stainless Steel Bolts",
        description: "Corrosion-resistant bolts for outdoor applications",
        price: 19.99,
        image: "/placeholder.svg?height=200&width=300",
        category: "fasteners",
      },
      {
        id: "6",
        name: "Linear Actuator",
        description: "Electric linear actuator for automation projects",
        price: 129.99,
        image: "/placeholder.svg?height=200&width=300",
        category: "automation",
      },
    ]

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

