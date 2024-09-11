import { Hono } from "hono";
import { addSticker, deleteSticker, getStickers } from "../controllers/sticker.controllers";
import { Binding } from "../types/envInterface";
import { authMiddleware, adminMiddleware } from "../middlewares/index";


const stickerRouter =  new Hono<{ Bindings: Binding }>(); 

stickerRouter.post("/", authMiddleware, adminMiddleware, addSticker); 
stickerRouter.delete("/", deleteSticker);
stickerRouter.get("/", getStickers);

export default stickerRouter; 