import { Context } from "hono"
import {registerValidation, signInValidation ,  } from "../utilities/validation/zodValidation";
import { createPrismaClient } from "../config/database";

const register = async(c: Context) => {
    const body = await c.req.json(); 

    try {
        const { DATABASE_URL, JWT_SECRET } = c.env;
        if (!DATABASE_URL || !JWT_SECRET) {
            return c.json({ message: "Server configuration error" }, 500);
        }

        const db = createPrismaClient(DATABASE_URL);

        const userData = registerValidation.safeParse(body);
        if(!userData.success){
            return c.json({
                message: "Invalid Input",
                error: userData.error.flatten()
            })
        };
        
    } catch (error) {
        return c.json({
            message: "Failed to register",
            error : error instanceof Error ? error.message : "Internal server error"
        },500)
    }
}

const signin = async(c: Context) => {
    const body = await c.req.json(); 

    try {
        const { DATABASE_URL, JWT_SECRET } = c.env;
        if (!DATABASE_URL || !JWT_SECRET) {
            return c.json({ message: "Server configuration error" }, 500);
        }

        const db = createPrismaClient(DATABASE_URL); 

        const userData = signInValidation.safeParse(body); 
        if(!userData.success){
            return c.json({
                message : "Invalid Input data",
                error: userData.error.flatten()
            })
        };
        
    } catch (error) {
        return c.json({
            message: "Failed to register",
            error : error instanceof Error ? error.message : "Internal server error"
        },500)
    }
}

export {
    register,
    signin
}
