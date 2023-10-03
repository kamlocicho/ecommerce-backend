// models/Product.ts

import mongoose, { Document, Schema } from "mongoose";

// Define the product schema
const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    // You can add more fields as needed, such as category, image URLs, etc.
});

// Create the Product model
export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
}

export const Product = mongoose.model<IProduct>("Product", productSchema);
