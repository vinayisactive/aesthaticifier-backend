import { Hono } from "hono";
import { createCategory, getCategories, categoryWithStickers, updateCategory, deleteCategory } from "../controllers/category.controllers";
import { authMiddleware, adminMiddleware } from "../middlewares/index";

const categoryRouter = new Hono(); 

categoryRouter.get("/", getCategories)
categoryRouter.get("/stickers", authMiddleware, categoryWithStickers);
categoryRouter.post("/", authMiddleware, adminMiddleware, createCategory);
categoryRouter.patch("/:category_id", authMiddleware, adminMiddleware, updateCategory)
categoryRouter.delete("/:category_id", authMiddleware, adminMiddleware, deleteCategory);

export default categoryRouter; 