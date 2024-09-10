import { z } from "zod";

const registerValidation = z.object({
    name: z.string(),
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