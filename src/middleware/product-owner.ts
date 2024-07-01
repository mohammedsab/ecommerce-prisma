import { NextFunction, Request, Response } from "express";
import { ErrorCode } from "../exceptions/root";
import { NotFoundException } from "../exceptions/not-found";
import { prismaClient } from "..";
import { BadRequestsException } from "../exceptions/bad-request";

const productOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await prismaClient.product.findUnique({
      where: { id: req.params.id },
    });
    if (product?.userId === req.user?.id) {
      next();
    } else {
      next(
        new BadRequestsException(
          "You are not authorized to update this product",
          ErrorCode.UNPROCESSABLE_ENTITY
        )
      );
    }
  } catch (error) {
    next(
      new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND)
    );
  }
};

export default productOwner;
