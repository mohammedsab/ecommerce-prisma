import {
  cancelOrder,
  changeStatus,
  getOrderById,
  listAllOrders,
  listUserOrders,
} from "./../controllers/order";
import { Router } from "express";
import authMiddleware from "../middleware/auth";
import { errorHandler } from "../error-handler";
import { createOrder, listOrders } from "../controllers/order";
import adminMiddleware from "../middleware/admin";

const orderRoutes: Router = Router();

orderRoutes.post("/", [authMiddleware], errorHandler(createOrder));
orderRoutes.get("/", errorHandler(listOrders));
orderRoutes.put("/:id/cancel", errorHandler(cancelOrder));
orderRoutes.get(
  "/index",
  [authMiddleware, adminMiddleware],
  errorHandler(listAllOrders)
);
orderRoutes.get(
  "/user/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(listUserOrders)
);
orderRoutes.put(
  "/:id/status",
  [authMiddleware, adminMiddleware],
  errorHandler(changeStatus)
);
orderRoutes.get("/:id", errorHandler(getOrderById));

export default orderRoutes;
