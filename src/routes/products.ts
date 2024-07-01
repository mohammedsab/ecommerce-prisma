import { Router } from "express";
import { errorHandler } from "../error-handler";
import {
  createProduct,
  deleteProduct,
  getProductById,
  listProduct,
  searchProducts,
  updateProduct,
} from "../controllers/products";
import authMiddleware from "../middleware/auth";
import adminMiddleware from "../middleware/admin";
import productOwner from "../middleware/product-owner";

const productRoutes: Router = Router();

productRoutes.post(
  "/",
  [authMiddleware, adminMiddleware],
  errorHandler(createProduct)
);

productRoutes.put(
  "/:id",
  [authMiddleware, adminMiddleware, productOwner],
  errorHandler(updateProduct)
);
productRoutes.delete(
  "/:id",
  [authMiddleware, adminMiddleware, productOwner],
  errorHandler(deleteProduct)
);
productRoutes.get("/", [], errorHandler(listProduct));
productRoutes.get("/search", errorHandler(searchProducts));
productRoutes.get("/:id", [], errorHandler(getProductById));

export default productRoutes;
