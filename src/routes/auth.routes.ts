import { Hono } from "hono";
import { checkAuth, register, signin } from "../controllers/auth.controllers";
import { Binding } from "../types/envInterface";
import authMiddleware from "../middlewares/auth.middlewares";

const authRouter = new Hono<{ Bindings: Binding }>(); 

authRouter.get("/",authMiddleware, checkAuth);
authRouter.post("/register", register);
authRouter.post("/signin", signin);


export default authRouter; 