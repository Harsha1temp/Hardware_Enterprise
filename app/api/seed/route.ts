// import { NextResponse } from "next/server"
// import { connectToDatabase } from "@/lib/db"
// import bcrypt from "bcryptjs"

// export async function GET() {
//   try {
//     const { db } = await connectToDatabase()

//     // Check if admin user already exists
//     const existingAdmin = await db.collection("users").findOne({ email: "admin@omsaienterprises.com" })

//     if (existingAdmin) {
//       return NextResponse.json({ message: "Admin user already exists" })
//     }

//     // Create admin user
//     const hashedPassword = await bcrypt.hash("admin123", 10)

//     await db.collection("users").insertOne({
//       name: "Admin User",
//       email: "admin@omsaienterprises.com",
//       phone: "+91 98765 43210",
//       password: hashedPassword,
//       address: "123 Hardware Street, Mumbai",
//       isAdmin: true,
//       createdAt: new Date(),
//     })

//     // Create regular user
//     const hashedUserPassword = await bcrypt.hash("user123", 10)

//     await db.collection("users").insertOne({
//       name: "Regular User",
//       email: "user@example.com",
//       phone: "+91 98765 43211",
//       password: hashedUserPassword,
//       address: "456 Customer Street, Mumbai",
//       isAdmin: false,
//       createdAt: new Date(),
//     })

//     return NextResponse.json({ message: "Seed data created successfully" })
//   } catch (error) {
//     console.error("Seed error:", error)
//     return NextResponse.json({ message: "Error creating seed data" }, { status: 500 })
//   }
// }
// app/api/seed/route.ts (Corrected Version using Mongoose & .env)
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';        // Use Mongoose connect helper
import Product from '@/models/Product'; // Import Product model (optional for products)
import User from '@/models/User';        // Import User model
import bcrypt from 'bcryptjs';          // Import bcryptjs

// Optional: Define sample products if you want to seed them too
const sampleProducts = [
   {
     name: "Premium Hammer",
     description: "Claw hammer with fiberglass handle for durability and comfort.",
     price: 1250,
     imageUrl: "/placeholder.svg?text=Hammer",
     stock: 30,
     category: "tools", // Make sure these fields exist in your ProductSchema
     vendor: "BuildRight"
   },
   // Add more sample products if desired
];


// Function to Seed Admin User using .env variables
const seedAdminUser = async () => {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
        console.log("SEED: ADMIN_EMAIL not set in .env.local, skipping admin seed.");
        return { success: false, message: "ADMIN_EMAIL not set." };
    }

    // Check if admin already exists using Mongoose
    const existingAdmin = await User.findOne({ email: adminEmail }).lean();
    if (existingAdmin) {
        console.log("SEED: Admin user already exists.");
        return { success: true, message: "Admin already exists." };
    }

    // Get other admin details from environment variables
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || "Admin";
    const adminPhone = process.env.ADMIN_PHONE || "0000000000";
    const adminAddress = process.env.ADMIN_ADDRESS || "Admin Address";

    if (!adminPassword) {
         console.error("SEED: ADMIN_PASSWORD not set in .env.local. Cannot seed admin.");
         return { success: false, message: "ADMIN_PASSWORD not set." };
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // Create the admin user document using Mongoose Model
        const adminUser = new User({
            name: adminName,
            email: adminEmail,
            phone: adminPhone,
            address: adminAddress,
            password: hashedPassword,
            role: 'admin' // Set the role field correctly
        });

        // Save the admin user to the database
        await adminUser.save();
        console.log("SEED: Admin user created successfully using Mongoose.");
        return { success: true, message: "Admin user created." };
    } catch(error: any) {
         console.error("SEED: Error creating admin user with Mongoose:", error);
          // Check for duplicate key errors specifically
          if (error.code === 11000) {
             console.error("SEED: Duplicate key error (email or phone likely exists).");
             return { success: false, message: `Admin user creation failed: ${error.keyValue ? Object.keys(error.keyValue)[0] : 'duplicate key'} already exists.` };
          }
         return { success: false, message: "Error creating admin user." };
    }
};


// Main GET Handler for the Seed Route
export async function GET(request: Request) {
  console.log("SEED: /api/seed route accessed.");
  let productMessage = "Product seeding skipped/failed.";
  let adminMessage = "Admin seeding skipped/failed.";
  let overallStatus = 500; // Default to error

  try {
    await dbConnect();
    console.log("SEED: Database connected.");

    // --- Seed Products (Optional - Uncomment if needed) ---
    // console.log("SEED: Deleting existing products...");
    // await Product.deleteMany({});
    // console.log("SEED: Inserting sample products...");
    // await Product.insertMany(sampleProducts);
    // productMessage = "Sample products inserted.";
    // console.log("SEED: Sample products inserted successfully.");
    productMessage = "Product seeding currently disabled in seed route.";

    // --- Seed Admin User ---
    const adminResult = await seedAdminUser();
    adminMessage = adminResult.message;

    // Determine overall status
    if (adminResult.success || adminMessage === "Admin already exists.") {
        overallStatus = 200; // OK if created or already exists
    }


    return NextResponse.json({
        message: "Seeding process finished.",
        adminStatus: adminMessage,
        productStatus: productMessage
    }, { status: overallStatus });

  } catch (error: any) {
    console.error("SEED: General error during seeding:", error);
    return NextResponse.json({
         message: "Seeding failed",
         error: error.message,
         adminStatus: adminMessage,
         productStatus: productMessage
    }, { status: 500 });
  }
}