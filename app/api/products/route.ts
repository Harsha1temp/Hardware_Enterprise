// app/api/products/route.ts (Complete Corrected Code)
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product, { IProduct } from '@/models/Product'; // Import Mongoose Product model and IProduct
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose'; // Use jose for verification

const JWT_SECRET = process.env.JWT_SECRET;

// Function to get the secret key as Uint8Array
const getJwtSecretKey = () => {
    if (!JWT_SECRET) {
        console.error('FATAL: JWT_SECRET environment variable is not set in /api/products');
        return null; // Indicate configuration issue
    }
    return new TextEncoder().encode(JWT_SECRET);
};

// --- GET all products (with filtering) ---
export async function GET(request: Request) {
  console.log("GET /api/products called");
  try {
    await dbConnect();
    console.log("GET /api/products: DB connected");

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const searchTerm = searchParams.get("search");

    // Build Mongoose query object
    const query: any = {};

    if (category) {
      query.category = category;
      console.log(`Filtering by category: ${category}`);
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        const parsedMin = Number.parseInt(minPrice);
        if (!isNaN(parsedMin)) query.price.$gte = parsedMin;
      }
      if (maxPrice) {
        const parsedMax = Number.parseInt(maxPrice);
        if (!isNaN(parsedMax)) query.price.$lte = parsedMax;
      }
       console.log(`Filtering by price: ${query.price?.$gte ? '>='+query.price.$gte : ''}${query.price?.$lte ? ' <='+query.price.$lte : ''}`);
    }

    if (searchTerm) {
        query.$or = [
            { name: { $regex: searchTerm, $options: 'i' } },
            { description: { $regex: searchTerm, $options: 'i' } }
        ];
        console.log(`Searching for term: ${searchTerm}`);
    }

    const products = await Product.find(query).lean();
    console.log(`Found ${products.length} products`);

    return NextResponse.json({ products });

  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ message: "Failed to fetch products" }, { status: 500 });
  }
}

// --- POST new product (admin only) ---
export async function POST(request: Request) {
  console.log("POST /api/products called");
  const secretKey = getJwtSecretKey();
  if (!secretKey) {
       return NextResponse.json({ message: "Server configuration error: JWT Secret not set." }, { status: 500 });
  }

  // 1. Verify Admin Authentication
  const token = cookies().get('auth_token')?.value;
  if (!token) {
    console.log("POST /api/products: No auth token found.");
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    console.log("POST /api/products: Verifying token...");
    const { payload } = await jwtVerify(token, secretKey);
    console.log("POST /api/products: Token payload:", payload);

    if (!payload || payload.role !== 'admin') {
      console.log(`POST /api/products: Authorization failed. Role: ${payload?.role}`);
      return NextResponse.json({ message: 'Authorization failed: Admin role required' }, { status: 403 });
    }
    console.log("POST /api/products: Admin user verified.");

    // 2. Connect to DB
    await dbConnect();
    console.log("POST /api/products: DB connected.");

    // 3. Parse Request Body
    const productData = await request.json();
    console.log("POST /api/products: Received product data:", productData);

    // 4. Validate Required Fields (Checking for 'image' key from form)
    if (!productData.name || productData.price == null || productData.stock == null || !productData.image) { // Check productData.image
      console.log("POST /api/products: Validation failed - missing required fields (name, price, stock, image).");
      return NextResponse.json({ message: 'Name, price, stock, and image URL are required' }, { status: 400 });
    }
     // Validate types
     const priceNum = Number(productData.price);
     const stockNum = Number(productData.stock);
     if (isNaN(priceNum) || isNaN(stockNum)) {
         console.log("POST /api/products: Validation failed - invalid price/stock format.");
         return NextResponse.json({ message: 'Price and stock must be valid numbers' }, { status: 400 });
    }

    // 5. Create New Product using Mongoose Model
    const newProduct = new Product({
      name: productData.name,
      description: productData.description || '',
      price: priceNum, // Use parsed number
      imageUrl: productData.image, // Map 'image' from form to 'imageUrl' in schema
      stock: stockNum,    // Use parsed number
      category: productData.category || 'uncategorized',
      vendor: productData.vendor || '',
    });

    console.log("POST /api/products: Saving new product...");
    const savedProduct = await newProduct.save();
    console.log("POST /api/products: Product saved successfully:", savedProduct._id);

    return NextResponse.json({ message: "Product created successfully", product: savedProduct }, { status: 201 });

  } catch (error: any) {
    console.error("Error creating product:", error);
    if (error.name === 'JsonWebTokenError' || error.name === 'JWTExpired' || error.name === 'JWTClaimValidationFailed') {
        cookies().delete('auth_token');
        return NextResponse.json({ message: `Authentication failed: ${error.message}` }, { status: 401 });
    }
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((el: any) => el.message);
        return NextResponse.json({ message: `Validation failed: ${messages.join(', ')}`, errors: error.errors }, { status: 400 });
    }
     if (error.code === 11000) { // Mongoose duplicate key error
         return NextResponse.json({ message: `Duplicate field error: ${Object.keys(error.keyValue).join(', ')} must be unique.` }, { status: 409 });
     }
    return NextResponse.json({ message: 'Error creating product' }, { status: 500 });
  }
}