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

const updateCategory = async(c: Context) => {
    try {
        const category_id = c.req.param('category_id'); 
        if(!category_id){
            return c.json({
                success: false, 
                message: "category_id is required"
            }, 400);
        }

        const { category } = await c.req.json();
        if(!category){
            return c.json({
                success: false, 
                message: "category is required"
            }, 400);
        };

        const { DATABASE_URL } = c.env;
        if (!DATABASE_URL) {
            return c.json({ 
                success: false, 
                message: "Server configuration error" 
            }, 500);
        }

        const db = createPrismaClient(DATABASE_URL); 

        const update = await db.category.update({
            data: {
                category: category
            },
            where: {
                id: category_id
            }
        }); 

        if(!update){
            return c.json({
                success: false, 
                message: "Failed to update category"
            }, 500);
        }

        return c.json({
            success: true, 
            message: "Updated category successfully",
            data: update
        }, 200);

    } catch (error) {
        return c.json({
            success: false,
            message: error instanceof Error ? error.message : "Internal server error"
        }, 500)
    }
}; 

const deleteCategory = async(c: Context) => {
    try {
        const category_id = c.req.param('category_id'); 
        if(!category_id){
            return c.json({
                success: false, 
                message: "category_id is required"
            }, 400);
        }

        const { DATABASE_URL } = c.env;
        if (!DATABASE_URL) {
            return c.json({ 
                success: false, 
                message: "Server configuration error" 
            }, 500);
        }

        const db = createPrismaClient(DATABASE_URL); 

        const category = await db.category.findUnique({
            where: {
                id: category_id
            },
            select: {
                stickers: true
            }
        });

        if(category?.stickers.length !== 0){
            return c.json({
                success: false,
                message: "Category contains sticker (delete stickers individually)"
            }, 500);
        }

        const deleted = await db.category.delete({
            where: {
                id: category_id
            }
        }); 

        if(!deleted){
            return c.json({
                success: false,
                message: "Failed to delete category"
            }, 500);
        }

        return c.json({
            success: true, 
            message: "Deleted category successfully",
            data: deleted
        }, 200);
                
    } catch (error) {
        return c.json({
            success: false,
            message: error instanceof Error ? error.message : "Internal server error"
        }, 500)
    }
}; 




export {
    createCategory,
    getCategories,
    categoryWithStickers,
    updateCategory,
    deleteCategory
}