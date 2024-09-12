import { Hono } from "hono";
import { authMiddleware } from "../middlewares";
import { addUserAddress, updateUser, updateUserAddress, userAddress, userDetails } from "../controllers/user.controllers";

const userRouter = new Hono(); 
userRouter.use("*", authMiddleware);

userRouter.get("/", userDetails); 
userRouter.post("/", updateUser); 

userRouter.get("/address", userAddress);
userRouter.post("/address", addUserAddress);
userRouter.patch("/address/:addressId", updateUserAddress);
userRouter.delete("/address/:addressId", updateUserAddress);

export default userRouter; 
