import { Context } from "hono"
import { registerValidation, signInValidation } from "../utilities/validation/zodValidation";
import { createPrismaClient } from "../config/database";
import bcryptjs from 'bcryptjs'
import { sign } from "hono/jwt";
import { setCookie } from "hono/cookie";

const register = async(c: Context) => {
    try {
        const body = await c.req.json(); 

        const userData = registerValidation.safeParse(body);
        if(!userData.success){
            return c.json({
                message: "Invalid Input",
                error: userData.error.flatten()
            },400)
        };

        const { name, email, password } = userData.data 

        const { DATABASE_URL, JWT_SECRET } = c.env;
        if (!DATABASE_URL || !JWT_SECRET) {
            return c.json({ message: "Server configuration error" }, 500);
        }

        const db = createPrismaClient(DATABASE_URL);

        const isExists = await db.user.findUnique({ where: { email }}); 

        if(isExists){
            return c.json({ message : "User already exists" } ,409); 
        }; 

        const hashedPassword = await bcryptjs.hash(password, 10); 
        
        const user = await db.user.create({
            data: {
                name: name,
                email: email, 
                password: hashedPassword
            },
            select: {
                name: true,
                email: true
            }
        }); 

        if(!user){
            return c.json({ message: "Failed to create user" }, 500); 
        }

        return c.json({
            message: "User registerd successfully",
            data: user
        }, 201);

    } catch (error) {
        return c.json({
            message: "Failed to register",
            error : error instanceof Error ? error.message : "Internal server error"
        },500)
    }
}

const signin = async(c: Context) => {
    try {
        const body = await c.req.json(); 

        const userData = signInValidation.safeParse(body); 
        if(!userData.success){
            return c.json({
                message : "Invalid Input data",
                error: userData.error.flatten()
            }, 400);
        };

        const { email, password } = userData.data

        const { DATABASE_URL, JWT_SECRET } = c.env;
        if (!DATABASE_URL || !JWT_SECRET) {
            return c.json({ message: "Server configuration error" }, 500);
        }

        const db = createPrismaClient(DATABASE_URL); 

        const user = await db.user.findUnique({
            where: { email }
        }); 

        if(!user){
            return c.json({ message: "No user found with this email" }, 404);
        }; 

        const isPasswordCorrect = await bcryptjs.compare(password, user.password); 
        if(!isPasswordCorrect){
            return c.json({ message: "Password is incorrect" }, 401); 
        }; 

        const oneMonthInSeconds : number = 30 * 24 * 60 * 60;
        const currentTime : number = Math.floor(Date.now() / 1000);
        const tokenExp : number =  currentTime + oneMonthInSeconds; 

        const token = await sign({ userId : user.id, exp: tokenExp }, JWT_SECRET); 
        if(!token){
            c.json({ message: "Failed to create token" }, 500);
        };

        setCookie(c, "token", token, {
            secure: true, 
            httpOnly: true, 
            sameSite: 'none',
            expires:  new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }); 

        return c.json({
            message: "User signin successfully",
            data : {
                id: user.id,
                email: user.email,
                token: token
            }
        }, 200);
        
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
