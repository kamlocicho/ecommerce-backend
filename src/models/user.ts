// src/models/user.ts
import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import { ICart } from "./cart";

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    cart: ICart;
}

const userSchema: Schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: "Cart",
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
});

// Hash the user's password before saving it to the database
userSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

export const User = mongoose.model<IUser>("User", userSchema);
