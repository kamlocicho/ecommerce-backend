// src/routes/authRoutes.ts
import { Router } from "express";
import CustomError from "../errors/customError";
import { Product } from "../models/product";
import { CastError } from "mongoose";

const router = Router();

// Get all products
router.get("/", async (req, res, next) => {
    try {
        const products = await Product.find();

        return res.status(201).json({ products });
    } catch (error) {
        next(error);
    }
});

// Get one product
router.get("/:id", async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) throw new CustomError("Product not found", 404);

        return res.status(201).json({ product });
    } catch (error: any) {
        if (error.message.startsWith("Cast to ObjectId")) {
            next(new CustomError("Invalid id", 400));
            return;
        }
        next(error);
    }
});

// Create product route
router.post("/", async (req, res, next) => {
    try {
        const body = req.body;
        const product = await Product.create({ ...body });

        return res.status(201).json({ product });
    } catch (error) {
        next(error);
    }
});

export default router;
