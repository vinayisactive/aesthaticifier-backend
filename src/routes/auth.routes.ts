import { Hono } from "hono";
import { register, signin } from "../controllers/auth.controllers";
import { Binding } from "../types/envInterface";

const authRouter = new Hono<{ Bindings: Binding }>(); 

authRouter.post("/register", register);
authRouter.post("/signin", signin);

export default authRouter; 