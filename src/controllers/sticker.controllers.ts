import { Context } from "hono";

const addSticker = async(c: Context) => {
    try {
        const { DATABASE_URL, JWT_SECRET } = c.env;
        if (!DATABASE_URL || !JWT_SECRET) {
            return c.json({ message: "Server configuration error" }, 500);
        }
        
    } catch (error) {
        return c.json({
            message: "Failed to register",
            error : error instanceof Error ? error.message : "Internal server error"
        },500)
    }
}; 

const deleteSticker = async(c: Context) =>{
    try {
        const { DATABASE_URL, JWT_SECRET } = c.env;
        if (!DATABASE_URL || !JWT_SECRET) {
            return c.json({ message: "Server configuration error" }, 500);
        }
        
    } catch (error) {
        return c.json({
            message: "Failed to register",
            error : error instanceof Error ? error.message : "Internal server error"
        },500)
    }
}; 

const getStickers = async(c: Context) => {
    try {
        const { DATABASE_URL, JWT_SECRET } = c.env;
        if (!DATABASE_URL || !JWT_SECRET) {
            return c.json({ message: "Server configuration error" }, 500);
        }
        
    } catch (error) {
        return c.json({
            message: "Failed to register",
            error : error instanceof Error ? error.message : "Internal server error"
        },500)
    }
}; 

export {
    addSticker, 
    deleteSticker, 
    getStickers
}; 