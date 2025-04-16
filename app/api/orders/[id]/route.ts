// app/api/orders/[id]/route.ts (Complete Mongoose/jose Version)
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order, { IOrder } from '@/models/Order'; // Use Mongoose Order model
import mongoose from 'mongoose';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import User from '@/models/User'; // Need User model for role check

const JWT_SECRET = process.env.JWT_SECRET;
const ALLOWED_STATUSES: IOrder['status'][] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']; // Define allowed statuses

// Function to get the secret key as Uint8Array
const getJwtSecretKey = () => {
    if (!JWT_SECRET) {
        console.error('FATAL: JWT_SECRET environment variable is not set in /api/orders/[id]');
        return null;
    }
    return new TextEncoder().encode(JWT_SECRET);
};

interface Params {
    id: string;
}

// --- GET Single Order (For Admin or Order Owner) ---
export async function GET(request: Request, { params }: { params: Params }) {
    const { id } = params;
    const secretKey = getJwtSecretKey();
    console.log(`GET /api/orders/${id} called`);

    if (!secretKey) return NextResponse.json({ message: "Server config error" }, { status: 500 });
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ message: "Invalid order ID format" }, { status: 400 });
    }

    // Verify Auth
     const token = cookies().get('auth_token')?.value;
     if (!token) return NextResponse.json({ message: 'Authentication required' }, { status: 401 });

    try {
        const { payload } = await jwtVerify(token, secretKey);
        if (!payload || !payload.userId || !mongoose.Types.ObjectId.isValid(payload.userId as string)) {
             return NextResponse.json({ message: 'Invalid authentication token' }, { status: 401 });
        }
        const userId = new mongoose.Types.ObjectId(payload.userId as string);
        const userRole = payload.role;

        await dbConnect();
        // Find order and populate user name/email for display
        const order = await Order.findById(id).populate<{ user: { name: string, email: string } }>('user', 'name email').lean();

        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        // Authorization: Allow admin OR the user who owns the order
        if (userRole !== 'admin' && order.user._id.toString() !== userId.toString()) {
             return NextResponse.json({ message: 'Not authorized to view this order' }, { status: 403 });
        }

        return NextResponse.json({ order });

    } catch (error: any) {
        console.error(`Error fetching order ${id}:`, error);
         if (error.name === 'JsonWebTokenError' || error.name === 'JWTExpired') {
             cookies().delete('auth_token');
             return NextResponse.json({ message: 'Authentication failed' }, { status: 401 });
         }
        return NextResponse.json({ message: "Failed to fetch order" }, { status: 500 });
    }
}


// --- PUT Update Order Status (Admin Only) ---
export async function PUT(request: Request, { params }: { params: Params }) {
    const { id } = params;
    console.log(`PUT /api/orders/${id} called`);
    const secretKey = getJwtSecretKey();

    if (!secretKey) return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
         return NextResponse.json({ message: "Invalid order ID format" }, { status: 400 });
    }

    // 1. Verify Admin Authentication
    const token = cookies().get('auth_token')?.value;
    if (!token) return NextResponse.json({ message: 'Authentication required' }, { status: 401 });

    try {
        const { payload } = await jwtVerify(token, secretKey);
        if (!payload || payload.role !== 'admin') {
            console.log(`PUT /api/orders/${id}: Auth failed. Role: ${payload?.role}`);
            return NextResponse.json({ message: 'Authorization failed: Admin role required' }, { status: 403 });
        }
        console.log(`PUT /api/orders/${id}: Admin verified.`);

        // 2. Parse Request Body for new status
        const body = await request.json();
        const newStatus = body.status as IOrder['status'];

        // 3. Validate New Status
        if (!newStatus || !ALLOWED_STATUSES.includes(newStatus)) {
             console.log(`PUT /api/orders/${id}: Invalid status value received: ${newStatus}`);
             return NextResponse.json({ message: `Invalid status value. Allowed statuses are: ${ALLOWED_STATUSES.join(', ')}` }, { status: 400 });
        }
         console.log(`PUT /api/orders/${id}: Received new status: ${newStatus}`);

        // 4. Connect to DB
        await dbConnect();
        console.log(`PUT /api/orders/${id}: DB connected.`);

        // 5. Update Order Status
        console.log(`PUT /api/orders/${id}: Updating order status...`);
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { $set: { status: newStatus } },
            { new: true, runValidators: true, lean: true } // Return updated doc, run schema validation
        ).populate('user', 'name email'); // Optionally populate user info in the response

        if (!updatedOrder) {
            console.log(`PUT /api/orders/${id}: Order not found during update.`);
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        console.log(`PUT /api/orders/${id}: Order status updated successfully.`);
        return NextResponse.json({ message: "Order status updated successfully", order: updatedOrder });

    } catch (error: any) {
        console.error(`Error updating order status ${id}:`, error);
        if (error.name === 'JsonWebTokenError' || error.name === 'JWTExpired') {
            cookies().delete('auth_token');
            return NextResponse.json({ message: 'Authentication failed' }, { status: 401 });
        }
         if (error.name === 'ValidationError') {
             return NextResponse.json({ message: 'Validation failed', errors: error.errors }, { status: 400 });
         }
        return NextResponse.json({ message: 'Error updating order status' }, { status: 500 });
    }
}

// Optional: Add DELETE if admins should be able to delete orders (ensure admin check)
// export async function DELETE(request: Request, { params }: { params: Params }) { ... }