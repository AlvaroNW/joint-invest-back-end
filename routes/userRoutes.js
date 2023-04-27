import { Router } from "express";

const userRoute = Router();

userRoute.post("/signup");
userRoute.post("/signin");
userRoute.get("/all");

export default userRoute;
