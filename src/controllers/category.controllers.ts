import { Context } from "hono";
import { createPrismaClient } from "../config/database";
import { number } from "zod";

const createCategory = async(c: Context) => {
    try {
        const { category } = await c.req.json(); 
        if(!category){
            return c.json({
                success: false, 
                message: "Category required"
            },400);
        }

        const { DATABASE_URL } = c.env;
        if (!DATABASE_URL) {
            return c.json({ 
                success: false, 
                message: "Server configuration error" 
            }, 500);
        }

        const db = createPrismaClient(DATABASE_URL);

        const ctg = await db.category.create({
            data:{
                category: category
            }
        }); 

        if(!ctg.id){
            return c.json({
                success: false,
                message: "Failed to create category"
            }, 500);
        }

        return c.json({
            success: true,
            message: "Category created successfully",
            data: ctg
        },200);

    } catch (error) {
        return c.json({
            success: false,
            message : error instanceof Error ? error.message : "Internal server error"
        },500);
    }
}

const getCategories = async(c: Context) => {
    try {
        const { DATABASE_URL } = c.env;
        if (!DATABASE_URL) {
            return c.json({ 
                success: false, 
                message: "Server configuration error" 
            }, 500);
        }

        const db = createPrismaClient(DATABASE_URL); 

        const categories = await db.category.findMany({
            select: {
                id: true,
                category: true,
            }
        });
        
        if(!categories){
            return c.json({
                success: false, 
                message: "Failed to fetch categories"
            }, 500);
        }


        return c.json({
            success: true, 
            message: "Fetched categories successfully",
            categories, 
        }, 200);

    } catch (error) {
        return c.json({
            success: false,
            message : error instanceof Error ? error.message : "Internal server error"
        },500);
    }
}

const categoryWithStickers = async(c: Context) => {
    try {   
        const { DATABASE_URL } = c.env;
        if (!DATABASE_URL) {
            return c.json({ 
                success: false, 
                message: "Server configuration error" 
            }, 500);
        }

        const db = createPrismaClient(DATABASE_URL); 

        const allCategoryStickers = await db.category.findMany({
            select: {
                category: true,
                stickers: true,
            }
        }); 

        if(!allCategoryStickers){
            return c.json({
                success: false, 
                message: "Failed to fetch stickers"
            }, 500);
        }

        return c.json({
            success: true, 
            message: "Fetched stickers successfully",
            data: allCategoryStickers
        },200);

    } catch (error) {
        return c.json({
            success: false,
            message : error instanceof Error ? error.message : "Internal server error"
        },500);
    }
}





export {
    createCategory,
    getCategories,
    categoryWithStickers
}