import { Request, Response } from "express";
import { CartItemSchema, CartSchema } from "../schema/cart";
import { Product } from "@prisma/client";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { InternalException } from "../exceptions/internal-exception";

export const addItemToCart = async (req: Request, res: Response) => {
  const validationResult = CartItemSchema.parse(req.body);
  let product: Product;
  try {
    product = await prismaClient.product.findFirstOrThrow({
      where: {
        id: validationResult.productId,
      },
    });

    // Check product quantity with product stock
    if (!(product.stock > validationResult.quantity)) {
      throw new NotFoundException(
        "More than quantity in stock",
        ErrorCode.PRODUCT_NOT_FOUND
      );
    }
  } catch (error) {
    throw new NotFoundException(
      "Product not found!",
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }

  try {
    let cart = await prismaClient.cart.findFirst({
      where: {
        userId: req.user?.id,
      },
    });

    if (!cart) {
      const cartValidation = CartSchema.safeParse(req.user?.id);
      cart = await prismaClient.cart.create({
        data: {
          userId: req.user?.id!,
        },
      });
    }

    const cartItem = await prismaClient.cartItem.create({
      data: {
        cartId: cart.id,
        quantity: validationResult.quantity,
        productId: validationResult.productId,
      },
    });
    res.status(200).json(cartItem);
  } catch (error) {
    throw new InternalException(
      "Internal server error",
      error,
      ErrorCode.INTERNAL_EXCEPTION
    );
  }
};

export const deleteItemFromCart = async (req: Request, res: Response) => {
  try {
    const userCart = await prismaClient.cart.findFirstOrThrow({
      where: {
        userId: req.user?.id,
      },
    });
    if (userCart) {
      await prismaClient.cartItem.delete({
        where: {
          id: req.params.id,
          cartId: userCart.id,
        },
      });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    throw new NotFoundException(
      "Item does not found",
      ErrorCode.CART_NOT_FOUND
    );
  }
};

export const changeQuantity = async (req: Request, res: Response) => {
  const userCart = await prismaClient.cart.findFirstOrThrow({
    where: {
      userId: req.user?.id,
    },
  });
  const updatedCart = await prismaClient.cartItem.update({
    where: {
      id: req.params.id,
      cartId: userCart.id,
    },
    data: {
      quantity: req.body.quantity,
    },
  });
  res.status(200).json(updatedCart);
};

export const getCart = async (req: Request, res: Response) => {
  try {
    const cart = await prismaClient.cart.findFirstOrThrow({
      where: {
        userId: req.user?.id,
      },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });

    res.status(200).json(cart);
  } catch (error) {
    throw new NotFoundException("Cart not found", ErrorCode.CART_NOT_FOUND);
  }
};
