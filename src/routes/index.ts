import { Hono } from "hono";
import authRouter from "./auth.routes";
import stickerRouter from "./stickers.routes";

const apiV1Router = new Hono(); 

apiV1Router.route("/auth", authRouter); 
apiV1Router.route("/sticker", stickerRouter);

export default apiV1Router; 