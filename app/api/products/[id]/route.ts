// // import { NextResponse } from "next/server"
// // import { connectToDatabase } from "@/lib/db"
// // import { cookies } from "next/headers"
// // import jwt from "jsonwebtoken"

// // // GET a single product
// // export async function GET(request: Request, { params }: { params: { id: string } }) {
// //   try {
// //     const { db, ObjectId } = await connectToDatabase()

// //     const product = await db.collection("products").findOne({ _id: new ObjectId(params.id) })

// //     if (!product) {
// //       return NextResponse.json({ message: "Product not found" }, { status: 404 })
// //     }

// //     return NextResponse.json({ product })
// //   } catch (error) {
// //     console.error("Error fetching product:", error)
// //     return NextResponse.json({ message: "Error fetching product" }, { status: 500 })
// //   }
// // }

// // // UPDATE a product (admin only)
// // export async function PUT(request: Request, { params }: { params: { id: string } }) {
// //   try {
// //     // Verify admin
// //     const token = cookies().get("auth_token")?.value

// //     if (!token) {
// //       return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
// //     }

// //     // Verify token
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as { userId: string }

// //     const { db, ObjectId } = await connectToDatabase()

// //     // Check if user is admin
// //     const user = await db.collection("users").findOne({ _id: new ObjectId(decoded.userId) })

// //     if (!user || !user.isAdmin) {
// //       return NextResponse.json({ message: "Not authorized" }, { status: 403 })
// //     }

// //     // Update product
// //     const productData = await request.json()

// //     const result = await db.collection("products").updateOne({ _id: new ObjectId(params.id) }, { $set: productData })

// //     if (result.matchedCount === 0) {
// //       return NextResponse.json({ message: "Product not found" }, { status: 404 })
// //     }

// //     const updatedProduct = await db.collection("products").findOne({ _id: new ObjectId(params.id) })

// //     return NextResponse.json({ message: "Product updated successfully", product: updatedProduct })
// //   } catch (error) {
// //     console.error("Error updating product:", error)
// //     return NextResponse.json({ message: "Error updating product" }, { status: 500 })
// //   }
// // }

// // // DELETE a product (admin only)
// // export async function DELETE(request: Request, { params }: { params: { id: string } }) {
// //   try {
// //     // Verify admin
// //     const token = cookies().get("auth_token")?.value

// //     if (!token) {
// //       return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
// //     }

// //     // Verify token
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as { userId: string }

// //     const { db, ObjectId } = await connectToDatabase()

// //     // Check if user is admin
// //     const user = await db.collection("users").findOne({ _id: new ObjectId(decoded.userId) })

// //     if (!user || !user.isAdmin) {
// //       return NextResponse.json({ message: "Not authorized" }, { status: 403 })
// //     }

// //     // Delete product
// //     const result = await db.collection("products").deleteOne({ _id: new ObjectId(params.id) })

// //     if (result.deletedCount === 0) {
// //       return NextResponse.json({ message: "Product not found" }, { status: 404 })
// //     }

// //     return NextResponse.json({ message: "Product deleted successfully" })
// //   } catch (error) {
// //     console.error("Error deleting product:", error)
// //     return NextResponse.json({ message: "Error deleting product" }, { status: 500 })
// //   }
// // }
// // app/api/products/[id]/route.ts (Updated with Mongoose)
// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/db';
// import Product from '@/models/Product'; // Use Mongoose model
// import mongoose from 'mongoose';       // For ObjectId validation

// interface Params {
//     id: string;
// }

// export async function GET(request: Request, { params }: { params: Params }) {
//   const { id } = params;

//   // Validate the ID format before querying
//   if (!id || !mongoose.Types.ObjectId.isValid(id)) {
//       return NextResponse.json({ message: "Invalid product ID format" }, { status: 400 });
//   }

//   try {
//     await dbConnect();

//     // Find product by ID using Mongoose
//     const product = await Product.findById(id).lean(); // Use lean()

//     if (!product) {
//       return NextResponse.json({ message: "Product not found" }, { status: 404 });
//     }

//     return NextResponse.json({ product });

//   } catch (error: any) {
//     console.error(`Error fetching product ${id}:`, error);
//     return NextResponse.json({ message: "Failed to fetch product" }, { status: 500 });
//   }
// }


// // Keep PUT and DELETE as is for now, update later with Mongoose and admin check
//  export async function PUT(request: Request, { params }: { params: Params }) {
//     // TODO: Implement using Mongoose, verify admin role from JWT/User model
//     console.log(`TEMP: PUT /api/products/${params.id} called`);
//     return NextResponse.json({ message: "Product update not implemented yet" }, { status: 501 });
//  }

//  export async function DELETE(request: Request, { params }: { params: Params }) {
//     // TODO: Implement using Mongoose, verify admin role from JWT/User model
//     console.log(`TEMP: DELETE /api/products/${params.id} called`);
//     return NextResponse.json({ message: "Product deletion not implemented yet" }, { status: 501 });
//  }
// app/api/products/[id]/route.ts (Complete Modified Code)
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product, { IProduct } from '@/models/Product'; // Import Mongoose model and IProduct
import mongoose from 'mongoose';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose'; // Use jose for verification

const JWT_SECRET = process.env.JWT_SECRET;

// Function to get the secret key as Uint8Array
const getJwtSecretKey = () => {
    if (!JWT_SECRET) {
        console.error(`FATAL: JWT_SECRET environment variable is not set in /api/products/[id]`);
        return null;
    }
    return new TextEncoder().encode(JWT_SECRET);
};

interface Params {
    id: string;
}

// --- GET a single product ---
export async function GET(request: Request, { params }: { params: Params }) {
  const { id } = params;
  console.log(`GET /api/products/${id} called`);

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      console.log(`GET /api/products/${id}: Invalid ID format.`);
      return NextResponse.json({ message: "Invalid product ID format" }, { status: 400 });
  }

  try {
    await dbConnect();
    console.log(`GET /api/products/${id}: DB connected.`);

    const product = await Product.findById(id).lean();

    if (!product) {
       console.log(`GET /api/products/${id}: Product not found.`);
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    console.log(`GET /api/products/${id}: Product found.`);
    return NextResponse.json({ product });

  } catch (error: any) {
    console.error(`Error fetching product ${id}:`, error);
    return NextResponse.json({ message: "Failed to fetch product" }, { status: 500 });
  }
}

// --- UPDATE a product (admin only) ---
export async function PUT(request: Request, { params }: { params: Params }) {
  const { id } = params;
  console.log(`PUT /api/products/${id} called`);
  const secretKey = getJwtSecretKey();

  if (!secretKey) {
       return NextResponse.json({ message: "Server configuration error: JWT Secret not set." }, { status: 500 });
  }

  // 1. Validate ID format
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
       console.log(`PUT /api/products/${id}: Invalid ID format.`);
       return NextResponse.json({ message: "Invalid product ID format" }, { status: 400 });
  }

  // 2. Verify Admin Authentication
  const token = cookies().get('auth_token')?.value;
  if (!token) {
    console.log(`PUT /api/products/${id}: No auth token.`);
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    console.log(`PUT /api/products/${id}: Verifying token...`);
    const { payload } = await jwtVerify(token, secretKey);
    console.log(`PUT /api/products/${id}: Token payload:`, payload);

    if (!payload || payload.role !== 'admin') {
      console.log(`PUT /api/products/${id}: Auth failed. Role: ${payload?.role}`);
      return NextResponse.json({ message: 'Authorization failed: Admin role required' }, { status: 403 });
    }
    console.log(`PUT /api/products/${id}: Admin verified.`);

    // 3. Connect to DB
    await dbConnect();
    console.log(`PUT /api/products/${id}: DB connected.`);

    // 4. Parse Request Body
    const productData: Partial<IProduct> = await request.json();
    console.log(`PUT /api/products/${id}: Received data:`, productData);

    // 5. Validate & Sanitize Data
    delete (productData as any)._id; // Never allow updating _id
    delete (productData as any).createdAt; // Let Mongoose handle timestamps
    delete (productData as any).updatedAt;
    if (productData.price !== undefined && isNaN(Number(productData.price))) {
         return NextResponse.json({ message: 'Price must be a valid number' }, { status: 400 });
    }
     if (productData.stock !== undefined && isNaN(Number(productData.stock))) {
         return NextResponse.json({ message: 'Stock must be a valid number' }, { status: 400 });
    }
     if (productData.price !== undefined) productData.price = Number(productData.price);
     if (productData.stock !== undefined) productData.stock = Number(productData.stock);

    // 6. Update Product using Mongoose Model
    console.log(`PUT /api/products/${id}: Updating product...`);
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: productData },
      { new: true, runValidators: true, lean: true }
    );

    if (!updatedProduct) {
       console.log(`PUT /api/products/${id}: Product not found during update.`);
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    console.log(`PUT /api/products/${id}: Product updated successfully.`);
    return NextResponse.json({ message: "Product updated successfully", product: updatedProduct });

  } catch (error: any) {
    console.error(`Error updating product ${id}:`, error);
     if (error.name === 'JsonWebTokenError' || error.name === 'JWTExpired' || error.name === 'JWTClaimValidationFailed') {
        cookies().delete('auth_token');
        return NextResponse.json({ message: `Authentication failed: ${error.message}` }, { status: 401 });
    }
    if (error.name === 'ValidationError') {
         return NextResponse.json({ message: 'Validation failed', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Error updating product' }, { status: 500 });
  }
}

// --- DELETE a product (admin only) ---
export async function DELETE(request: Request, { params }: { params: Params }) {
   const { id } = params;
   console.log(`DELETE /api/products/${id} called`);
   const secretKey = getJwtSecretKey();

   if (!secretKey) {
       return NextResponse.json({ message: "Server configuration error: JWT Secret not set." }, { status: 500 });
   }

   // 1. Validate ID format
   if (!id || !mongoose.Types.ObjectId.isValid(id)) {
       console.log(`DELETE /api/products/${id}: Invalid ID format.`);
       return NextResponse.json({ message: "Invalid product ID format" }, { status: 400 });
   }

   // 2. Verify Admin Authentication
   const token = cookies().get('auth_token')?.value;
   if (!token) {
     console.log(`DELETE /api/products/${id}: No auth token.`);
     return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
   }

   try {
     console.log(`DELETE /api/products/${id}: Verifying token...`);
     const { payload } = await jwtVerify(token, secretKey);
      console.log(`DELETE /api/products/${id}: Token payload:`, payload);

     if (!payload || payload.role !== 'admin') {
       console.log(`DELETE /api/products/${id}: Auth failed. Role: ${payload?.role}`);
       return NextResponse.json({ message: 'Authorization failed: Admin role required' }, { status: 403 });
     }
     console.log(`DELETE /api/products/${id}: Admin verified.`);

     // 3. Connect to DB
     await dbConnect();
     console.log(`DELETE /api/products/${id}: DB connected.`);

     // 4. Delete Product using Mongoose Model
     console.log(`DELETE /api/products/${id}: Deleting product...`);
     const result = await Product.deleteOne({ _id: id });

     if (result.deletedCount === 0) {
       console.log(`DELETE /api/products/${id}: Product not found.`);
       return NextResponse.json({ message: "Product not found" }, { status: 404 });
     }

     console.log(`DELETE /api/products/${id}: Product deleted successfully.`);
     return NextResponse.json({ message: "Product deleted successfully" });

   } catch (error: any) {
      console.error(`Error deleting product ${id}:`, error);
      if (error.name === 'JsonWebTokenError' || error.name === 'JWTExpired' || error.name === 'JWTClaimValidationFailed') {
          cookies().delete('auth_token');
          return NextResponse.json({ message: `Authentication failed: ${error.message}` }, { status: 401 });
      }
      return NextResponse.json({ message: 'Error deleting product' }, { status: 500 });
   }
}