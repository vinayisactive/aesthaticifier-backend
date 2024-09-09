import { Context, Next } from "hono";

const authMiddleware = async(c: Context, next: Next) => {
    try {
        
    } catch (error) {
        return c.json({
            message: "Invalid token or authentication error",
            error: error instanceof Error ? error.message : "Internal server error",
        },500);
    }
};

export default authMiddleware; 