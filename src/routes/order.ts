import {
  cancelOrder,
  EditOrderStatus,
  getOrderById,
} from "./../controllers/order";
import { Router } from "express";
import authMiddleware from "../middleware/auth";
import { errorHandler } from "../error-handler";
import { createOrder, listOrders } from "../controllers/order";

const orderRoutes: Router = Router();

orderRoutes.post("/", [authMiddleware], errorHandler(createOrder));
orderRoutes.get("/", errorHandler(listOrders));
orderRoutes.put("/:id/cancel", errorHandler(cancelOrder));
orderRoutes.get("/:id", errorHandler(getOrderById));
orderRoutes.put("/:id", errorHandler(EditOrderStatus));

export default orderRoutes;
