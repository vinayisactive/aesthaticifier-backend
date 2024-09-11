import { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";

const authMiddleware = async(c: Context, next: Next) => {
    try {
        const token = getCookie(c, 'token')
        
        const {JWT_SECRET } = c.env;
        if (!JWT_SECRET) {
            return c.json({ 
                success: false,
                message: "Server configuration error" 
            }, 500);
        }

        if (!token) {
            return c.json({
                success: false,
                message: "User is not signed-in",
                authenticated: false
            }, 401);
        }

        const currentTime : number = Math.floor(Date.now() / 1000);

        const decodedToken = await verify(token, JWT_SECRET); 
        if (decodedToken.exp && decodedToken.exp < currentTime) {
            return c.json({ 
                success: false,
                message: "Token has expired"
            }, 401);
        }; 

        c.set('user', {
            token: decodedToken.userId,
            isAdmin: decodedToken.isAdmin
        }); 

        await next(); 

    } catch (error) {
        return c.json({
            success: false,
            message: error instanceof Error ? error.message : "Internal server"
        },500);
    }
};

export default authMiddleware; 