import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { productSchema } from "../schema/products";

export const createProduct = async (req: Request, res: Response) => {
  productSchema.parse(req.body);

  const product = await prismaClient.product.create({
    data: {
      ...req.body,
      tags: req.body.tags.join(","),
      userId: req.user?.id,
    },
  });

  res.json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
  const product = req.body;

  if (product.tags) {
    product.tags = product.tags.join(",");
  }
  const updateProduct = await prismaClient.product.update({
    where: { id: req.params.id },
    data: product,
  });
  res.json(updateProduct);
};

export const deleteProduct = async (req: Request, res: Response) => {
  const updateProduct = await prismaClient.product.delete({
    where: { id: req.params.id },
  });
  res.json(updateProduct);
};

export const listProduct = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 20;

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const products = await prismaClient.product.findMany({
    skip,
    take,
  });
  const count = await prismaClient.product.count();
  res.json({
    data: products,
    totalPages: Math.ceil(count / pageSize),
    currentPage: page,
    pageSize,
  });
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const product = await prismaClient.product.findUnique({
    where: { id: req.params.id },
  });
  if (!product) {
    throw new NotFoundException(
      "Product not found!",
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }
  res.json(product);
};
