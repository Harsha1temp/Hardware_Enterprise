// models/Order.ts
import mongoose, { Schema, Document, models, Model, Types } from 'mongoose';
import { IUser } from './User'; // Import IUser interface
import { IProduct } from './Product'; // Import IProduct interface

interface OrderItem {
  product: Types.ObjectId | IProduct; // Reference Product ID or populate
  name: string; // Store name at time of order
  price: number; // Store price at time of order
  quantity: number;
}

export interface IOrder extends Document {
  user: Types.ObjectId | IUser; // Reference User ID or populate
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: string; // Copied from user or entered at checkout
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: 'Cash on Delivery';
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema: Schema<OrderItem> = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
}, { _id: false }); // Don't create separate IDs for subdocuments unless needed

const OrderSchema: Schema<IOrder> = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [OrderItemSchema],
  totalAmount: { type: Number, required: true },
  shippingAddress: { type: String, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  paymentMethod: { type: String, default: 'Cash on Delivery', required: true },
}, { timestamps: true });

const Order: Model<IOrder> = models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;