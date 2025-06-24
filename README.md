# 🛠️ Hardware Enterprise Website

A full-stack B2B commerce platform built for a hardware manufacturing company that specializes in **stone crusher spare parts**, **conveyor belts**, and **custom hardware solutions**. This platform allows customers to view available products, submit detailed orders, and for admins to manage inventory and orders through a secure login system.

## 🚀 Project Purpose

The platform serves two main purposes:
- Acts as the **official digital presence** of the hardware company.
- Functions as a **B2B commerce platform**, enabling users to browse products, place orders, and get custom quotations.

---

## 🌐 Live Demo

> Coming Soon  
<!-- Or add a link like: https://hardware-enterprise.vercel.app -->

---

## 🧱 Tech Stack

### 🖥️ Frontend
- **React.js**
- **Tailwind CSS**
- **ShadCN (UI components library)**

### 🧠 Backend
- **Next.js (App Router)**
- **Node.js**
- **MongoDB (Database)**

### 📦 Other Libraries
- **Axios** – API handling
- **Zod / React Hook Form** – form validation
- **NextAuth / JWT** – authentication
- **Mongoose** – ODM for MongoDB
- **Razorpay** (Planned) – payment gateway

---

## 📑 Features

### 🧑‍💼 User Features
- Register and login securely
- Browse product catalog with specs and images
- Add products to cart
- Place order with specific quantity & notes
- Track order status (Pending/Approved/Rejected)

### 🛠️ Admin Features
- Admin login with elevated privileges
- Add / edit / delete products
- View & manage incoming orders
- Approve / Reject orders with real-time updates

---

## 🖼️ Pages Overview

| Page       | Description |
|------------|-------------|
| `/` (Home) | Welcome page with company highlights |
| `/products` | View all available products |
| `/cart` | Cart and checkout functionality |
| `/orders` | Track your orders (User/Admin view varies) |
| `/about` | Company background and contact info |

---

## 🔐 Authentication Flow

- Auth implemented via **NextAuth** or **JWT (manual)** based system
- Role-based access control:
  - `user` – limited to placing/viewing orders
  - `admin` – can manage product catalog and order approvals

---

## 🗂️ Folder Structure (Simplified)

