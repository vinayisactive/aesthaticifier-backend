import { Hono } from "hono";
import authRouter from "./auth.routes";
import stickerRouter from "./stickers.routes";
import categoryRouter from "./category.routes";
import designRouter from "./design.routes";

const apiV1Router = new Hono(); 

apiV1Router.route("/auth", authRouter); 
apiV1Router.route("/sticker", stickerRouter);
apiV1Router.route("/category", categoryRouter);
apiV1Router.route("/design", designRouter);

export default apiV1Router; 