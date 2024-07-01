import { Router } from "express";
import authMiddleware from "../middleware/auth";
import { errorHandler } from "../error-handler";
import {
  addAddress,
  changeUserRole,
  deleteAddress,
  getUserById,
  listAddress,
  listUsers,
  updateUser,
} from "../controllers/users";
import adminMiddleware from "../middleware/admin";

const userRoutes: Router = Router();

userRoutes.post("/adress", [authMiddleware], errorHandler(addAddress));
userRoutes.delete("/adress/:id", [authMiddleware], errorHandler(deleteAddress));
userRoutes.get("/adress", [authMiddleware], errorHandler(listAddress));
userRoutes.put("/", [authMiddleware], errorHandler(updateUser));
userRoutes.put("/:id/role", [
  authMiddleware,
  adminMiddleware,
  errorHandler(changeUserRole),
]);
userRoutes.get("/", [authMiddleware, adminMiddleware], errorHandler(listUsers));
userRoutes.get(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(getUserById)
);

export default userRoutes;
