// src/routes/authRoutes.ts
import { Router } from "express";
import CustomError from "../errors/customError";
import { Product } from "../models/product";
import { CastError } from "mongoose";
import { User } from "../models/user";
import { Cart, CartItem } from "../models/cart";

const router = Router();

// Get cart
router.get("/", async (req, res, next) => {
    try {
        const userWithCart = await User.findById(req.userId).populate("cart");

        return res.status(201).json(userWithCart);
    } catch (error) {
        next(error);
    }
});

// Add product to cart
router.post("/", async (req, res, next) => {
    try {
        const { quantity, productId } = req.body;
        const product = await Product.findById(productId);
        if (!product) throw new CustomError("Product not found", 404);

        const cart = await Cart.findOne({ user: req.userId }).populate({
            path: "items",
            populate: { path: "product" },
        });

        if (!cart) throw new CustomError("Cart doesn't exist.", 400);

        const cartItem = await CartItem.create({ product, quantity });

        cart.items.push(cartItem);
        let sum = 0;
        cart.items.forEach((item) => {
            sum += item.product.price * item.quantity;
        });
        cart.price = parseFloat(sum.toFixed(2));

        await cart.save();

        return res.status(201).json(cart);
    } catch (error: any) {
        if (error.message.startsWith("Cast to ObjectId")) {
            next(new CustomError("Invalid id", 400));
            return;
        }
        next(error);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.userId }).populate({
            path: "items",
            populate: { path: "product" },
        });

        if (!cart) throw new CustomError("Cart doesn't exist.", 400);

        const newItems = cart.items.filter((item) => item.id != req.params.id);
        await CartItem.findByIdAndDelete(req.params.id);

        cart.items = newItems;
        let sum = 0;
        cart.items.forEach((item) => {
            sum += item.product.price * item.quantity;
        });
        cart.price = parseFloat(sum.toFixed(2));

        await cart.save();

        return res.status(201).json(cart);
    } catch (error) {}
});

export default router;
