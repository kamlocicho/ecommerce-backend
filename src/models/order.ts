import mongoose, { Document } from "mongoose";
import { IUser } from "./user";
import { ICartItem } from "./cart";

export interface IOrder extends Document {
    user: IUser;
    products: ICartItem;
    status: string;
    total: number;
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
}

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "CartItem",
            },
        ],
        status: {
            type: String,
            enum: ["Pending", "Shipped", "Delivered"],
            default: "Pending",
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        shippingAddress: {
            street: String,
            city: String,
            state: String,
            postalCode: String,
            country: String,
        },
    },
    { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
