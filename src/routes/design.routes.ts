import { Hono } from "hono";
import { createAsset, createDesign, deleteAsset, getAssets, getDesigns, updateDesign } from "../controllers/design.controllers";
import { authMiddleware } from "../middlewares";

const designRouter = new Hono(); 
designRouter.use("*",authMiddleware)

designRouter.post("/", createDesign);
designRouter.get("/", getDesigns);
designRouter.patch("/:designId", updateDesign);

designRouter.post("/:designId/asset", createAsset);
designRouter.get("/:designId/asset", getAssets);


designRouter.delete("/asset/:assetId", deleteAsset);

export default designRouter;