import { Request, Response } from "express";
import { prismaClient } from "..";

export const createOrder = async (req: Request, res: Response) => {
  // TODO: create a transaction
  // TODO: list all the cart items and proceed id cart is not empty
  // TODO: calculate the total amount
  // TODO: fetch address of user
  // TODO: define computed field for foramatted address on address module
  // TODO: create a order and order productsorder products
  // TODO: create event

  return await prismaClient.$transaction(async (tx) => {
    console.log(req.user?.id);

    const cart = await tx.cart.findFirstOrThrow({
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

    if (cart?.cartItems.length === 0) {
      res.status(401).json({ message: "cart is empty" });
    }

    const price = cart?.cartItems.reduce(
      (acc, item) => acc + +item.product.price * item.quantity,
      0
    );

    const address = await tx.address.findFirst({
      where: {
        id: req.user?.defaultShippingAddress!,
      },
    });

    const order = await tx.order.create({
      data: {
        userId: req.user?.id!,
        total: price!,
        shippingAddress: address?.formattedAddress!,
        orderItems: {
          create: cart?.cartItems.map((cart) => {
            return {
              productId: cart.productId,
              quantity: cart.quantity,
              price: cart.product.price,
            };
          }),
        },
      },
    });

    await tx.cartItem.deleteMany({
      where: {
        cartId: cart?.id,
      },
    });

    await tx.cart.delete({
      where: {
        id: cart?.id,
      },
    });

    res.status(200).json(order);
  });
};

export const listOrders = async (req: Request, res: Response) => {
  const orders = await prismaClient.order.findMany({
    where: {
      userId: req.user?.id,
    },
  });

  res.json(orders);
};

export const cancelOrder = async (req: Request, res: Response) => {
  const order = await prismaClient.order.update({
    where: {
      userId: req.user?.id,
      id: req.params.id,
    },
    data: {
      status: "CANCELLED",
    },
  });
  res.json(order);
};

export const getOrderById = async (req: Request, res: Response) => {
  const order = await prismaClient.order.findFirst({
    where: {
      userId: req.user?.id,
      id: req.params.id,
    },
    include: {
      orderItems: true,
    },
  });
  res.json(order);
};

// export const EditOrderStatus = async (req: Request, res: Response) => {};

export const listAllOrders = async (req: Request, res: Response) => {
  let whereClause = {};
  const status = req.query.status;
  if (status) {
    whereClause = {
      status,
    };
  }
  const orders = await prismaClient.order.findMany({
    where: whereClause,
    skip: +req.query.skip! || 0,
    take: 5,
  });
  res.json(orders);
};

export const changeStatus = async (req: Request, res: Response) => {
  const order = await prismaClient.order.update({
    where: {
      id: req.params.id,
    },
    data: {
      status: req.body.status,
    },
  });
  res.json(order);
};

export const listUserOrders = async (req: Request, res: Response) => {
  let whereClause: any = { userId: req.params.id };
  const status = req.params.status;
  if (status) {
    whereClause = {
      ...whereClause,
      status,
    };
  }
  const orders = await prismaClient.order.findMany({
    where: whereClause,
    skip: +req.query.skip! || 0,
    take: 5,
  });
  res.json(orders);
};
