import { Hono } from "hono";
import { addSticker, deleteSticker, getStickers } from "../controllers/sticker.controllers";
import { Binding } from "../types/envInterface";

const stickerRouter =  new Hono<{ Bindings: Binding }>(); 

stickerRouter.post("/", addSticker); 
stickerRouter.delete("/", deleteSticker);
stickerRouter.get("/", getStickers);

export default stickerRouter; 