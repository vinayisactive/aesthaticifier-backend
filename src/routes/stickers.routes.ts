import { Hono } from "hono";
import { addSticker, deleteSticker } from "../controllers/sticker.controllers";
import { Binding } from "../types/envInterface";
import { authMiddleware, adminMiddleware } from "../middlewares/index";


const stickerRouter =  new Hono<{ Bindings: Binding }>(); 

stickerRouter.post("/", authMiddleware, adminMiddleware, addSticker); 
stickerRouter.delete("/:public_id/:sticker_id",authMiddleware, adminMiddleware, deleteSticker);

export default stickerRouter; 