import mongoose, { Document, Schema } from "mongoose";
import { IProduct } from "./product";

const cartItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
    },
});

export interface ICartItem extends Document {
    product: IProduct;
    quantity: number;
}

const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [cartItemSchema],
    price: { type: Number, default: 0 },
});

export interface ICart extends Document {
    user: string;
    items: ICartItem[];
    price: number;
}

export const CartItem = mongoose.model<ICartItem>("CartItem", cartItemSchema);
export const Cart = mongoose.model<ICart>("Cart", cartSchema);
