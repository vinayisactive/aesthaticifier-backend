import { Hono } from "hono";
import { createCategory, getCategories, categoryWithStickers } from "../controllers/category.controllers";
import { authMiddleware, adminMiddleware } from "../middlewares/index";

const categoryRouter = new Hono(); 
categoryRouter.get("/", getCategories)
categoryRouter.get("/stickers", authMiddleware, categoryWithStickers);
categoryRouter.post("/", authMiddleware, adminMiddleware, createCategory);
categoryRouter.patch("/")
categoryRouter.delete("/");

export default categoryRouter; 