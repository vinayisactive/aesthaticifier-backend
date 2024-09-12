import { Hono } from "hono";
import { createAsset, createDesign, deleteAsset, getAssets, getDesigns, updateAsset, updateDesign } from "../controllers/design.controllers";
import { authMiddleware } from "../middlewares";

const designRouter = new Hono(); 
designRouter.use("*",authMiddleware)

designRouter.post("/", createDesign);
designRouter.get("/", getDesigns);
designRouter.patch("/:design_id", updateDesign);

designRouter.route("/:design_id/asset", designRouter)
  .post(createAsset)
  .get(getAssets);

  designRouter.route("/asset/:asset_id", designRouter)
  .patch(updateAsset)
  .delete(deleteAsset);

export default designRouter;