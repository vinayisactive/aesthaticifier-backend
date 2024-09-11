import { Context, Next } from "hono";

const adminMiddleware = async(c: Context, next: Next) => {
    try {
        const user = c.get('user'); 

        if(!user?.isAdmin){
            return c.json({
                success: false,
                message: "Permission denied"
            }, 403);
        }

        await next(); 

    } catch (error) {
        return c.json({
            success: false,
            message: error instanceof Error ? error.message : "Internal server"
        }, 500);
    }
}

export default adminMiddleware; 