// app/api/orders/route.ts (Complete Modified Code)
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';       // Use Mongoose Order model
import Product from '@/models/Product';     // Needed to potentially check/update stock
import User from '@/models/User';         // Needed to check user role for GET
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET;

// Function to get the secret key as Uint8Array
const getJwtSecretKey = () => {
    if (!JWT_SECRET) {
        console.error('FATAL: JWT_SECRET environment variable is not set in /api/orders');
        return null;
    }
    return new TextEncoder().encode(JWT_SECRET);
};

// --- GET Orders (User's own or All for Admin) ---
export async function GET(request: Request) {
  console.log("GET /api/orders called");
  const secretKey = getJwtSecretKey();
   if (!secretKey) {
       return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
   }

  // 1. Verify Authentication
  const token = cookies().get('auth_token')?.value;
  if (!token) {
    console.log("GET /api/orders: No auth token found.");
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    console.log("GET /api/orders: Verifying token...");
    const { payload } = await jwtVerify(token, secretKey);
     console.log("GET /api/orders: Token payload:", payload);

    if (!payload || !payload.userId || !mongoose.Types.ObjectId.isValid(payload.userId as string)) {
        console.log("GET /api/orders: Invalid token payload or userId.");
        return NextResponse.json({ message: 'Invalid authentication token' }, { status: 401 });
    }

    // 2. Connect to DB
    await dbConnect();
    console.log("GET /api/orders: DB connected.");

    // 3. Determine Query based on Role (Fetch user to be sure role is current)
    const requestingUser = await User.findById(payload.userId).lean();
    if (!requestingUser) {
        console.log("GET /api/orders: User from token not found in DB.");
         cookies().delete('auth_token'); // Clean up cookie
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    let query = {};
    if (requestingUser.role !== 'admin') {
      // Regular user only gets their own orders
      query = { user: requestingUser._id }; // Query by user ObjectId
      console.log(`GET /api/orders: Fetching orders for user ${requestingUser._id}`);
    } else {
        // Admin gets all orders
        console.log(`GET /api/orders: Admin fetching all orders.`);
    }

    // 4. Fetch Orders
    const orders = await Order.find(query)
        .populate('user', 'name email') // Optional: Populate user name/email
        // .populate('items.product', 'name imageUrl') // Optional: Populate basic product info
        .sort({ createdAt: -1 }) // Sort newest first
        .lean();

    console.log(`GET /api/orders: Found ${orders.length} orders.`);
    return NextResponse.json({ orders });

  } catch (error: any) {
    console.error("Error fetching orders:", error);
    if (error.name === 'JsonWebTokenError' || error.name === 'JWTExpired' || error.name === 'JWTClaimValidationFailed') {
        cookies().delete('auth_token');
        return NextResponse.json({ message: `Authentication failed: ${error.message}` }, { status: 401 });
    }
    return NextResponse.json({ message: 'Error fetching orders' }, { status: 500 });
  }
}


// --- POST New Order ---
export async function POST(request: Request) {
    console.log("POST /api/orders called");
    const secretKey = getJwtSecretKey();
    if (!secretKey) {
       return NextResponse.json({ message: "Server configuration error: JWT Secret not set." }, { status: 500 });
    }

    // 1. Verify Authentication
    const token = cookies().get('auth_token')?.value;
    if (!token) {
        console.log("POST /api/orders: No auth token found.");
        return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    try {
        console.log("POST /api/orders: Verifying token...");
        const { payload } = await jwtVerify(token, secretKey);
        console.log("POST /api/orders: Token payload:", payload);

        if (!payload || !payload.userId || !mongoose.Types.ObjectId.isValid(payload.userId as string)) {
             console.log("POST /api/orders: Invalid token payload or userId.");
             return NextResponse.json({ message: 'Invalid authentication token' }, { status: 401 });
        }
        const userId = new mongoose.Types.ObjectId(payload.userId as string);
        console.log(`POST /api/orders: User ${userId} verified.`);

        // 2. Connect to DB
        await dbConnect();
        console.log("POST /api/orders: DB connected.");

        // 3. Parse Request Body
        const orderInput = await request.json();
        console.log("POST /api/orders: Received order data:", orderInput);

        // 4. Validate Input Data
        if (!orderInput.items || !Array.isArray(orderInput.items) || orderInput.items.length === 0 || !orderInput.shippingAddress || orderInput.totalAmount == null) {
            console.log("POST /api/orders: Validation failed - missing required fields.");
            return NextResponse.json({ message: 'Missing required order information (items, shippingAddress, totalAmount).' }, { status: 400 });
        }

        // Basic validation for items structure
        const itemsValid = orderInput.items.every((item: any) =>
            item.product && mongoose.Types.ObjectId.isValid(item.product) &&
            item.name && typeof item.name === 'string' &&
            item.price != null && typeof item.price === 'number' &&
            item.quantity != null && typeof item.quantity === 'number' && item.quantity > 0
        );

        if (!itemsValid) {
             console.log("POST /api/orders: Validation failed - invalid items structure.");
             return NextResponse.json({ message: 'Invalid data format in order items.' }, { status: 400 });
        }

        // TODO: Optional - Server-side recalculation/verification of totalAmount based on current product prices
        // This prevents users from manipulating the price on the client.
        // Fetch products by IDs in items, calculate total, compare with orderInput.totalAmount.

        // TODO: Optional - Decrease product stock (requires careful transaction handling)
        // This is complex and needs atomicity (all stock updates succeed or order fails).
        // Might be better handled in a separate order processing step later.

        // 5. Create New Order using Mongoose Model
        const newOrder = new Order({
            user: userId, // Use the verified userId from token
            items: orderInput.items.map((item: any) => ({ // Ensure items match OrderItemSchema
                product: new mongoose.Types.ObjectId(item.product),
                name: item.name,
                price: item.price,
                quantity: item.quantity
            })),
            totalAmount: orderInput.totalAmount,
            shippingAddress: orderInput.shippingAddress,
            customer: orderInput.customer, // Include customer details if sent
            paymentMethod: orderInput.paymentMethod || 'Cash on Delivery', // Default if not provided
            status: 'Pending', // Initial status
            notes: orderInput.notes || '',
            // createdAt/updatedAt are handled by timestamps: true in schema
        });

        console.log("POST /api/orders: Saving new order...");
        const savedOrder = await newOrder.save();
        console.log("POST /api/orders: Order saved successfully:", savedOrder._id);

        // Consider what data to return - maybe just the ID or the full order
        return NextResponse.json({ message: "Order created successfully", order: savedOrder }, { status: 201 });

    } catch (error: any) {
        console.error("Error creating order:", error);
         if (error.name === 'JsonWebTokenError' || error.name === 'JWTExpired' || error.name === 'JWTClaimValidationFailed') {
            cookies().delete('auth_token');
            return NextResponse.json({ message: `Authentication failed: ${error.message}` }, { status: 401 });
        }
        if (error.name === 'ValidationError') {
             const messages = Object.values(error.errors).map((el: any) => el.message);
             return NextResponse.json({ message: `Validation failed: ${messages.join(', ')}`, errors: error.errors }, { status: 400 });
        }
        return NextResponse.json({ message: 'Error creating order' }, { status: 500 });
    }
}