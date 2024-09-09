import { z } from "zod";

const registerValidation = z.object({
    name: z.string().optional(),
    username: z.string().min(6),
    email: z.string().email(),
    password: z.string()
}); 

const signInValidation = z.object({
    email: z.string().email(),
    password: z.string()
}); 

export {
    registerValidation,
    signInValidation
}