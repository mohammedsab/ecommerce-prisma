import { errorHandler } from "./../error-handler";
import { NextFunction, Request, response, Response } from "express";
import { AddressSchema, UpdateUserSchema } from "../schema/users";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { Address } from "@prisma/client";
import { BadRequestsException } from "../exceptions/bad-request";

export const addAddress = async (req: Request, res: Response) => {
  AddressSchema.parse(req.body);

  const address = await prismaClient.address.create({
    data: { ...req.body, userId: req.user?.id },
  });
  res.json(address);
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const address = await prismaClient.address.delete({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ date: address });
  } catch (error) {
    throw new NotFoundException(
      "Address does not exists",
      ErrorCode.ADDRESS_NOT_FOUND
    );
  }
};

export const listAddress = async (req: Request, res: Response) => {
  const addresses = await prismaClient.address.findMany({
    where: {
      userId: req.user?.id,
    },
  });

  res.json(addresses);
};

export const updateUser = async (req: Request, res: Response) => {
  const validateData = UpdateUserSchema.parse(req.body);
  let shippingAddress: Address;
  let billingAddress: Address;
  if (validateData.defaultShippingAddress) {
    try {
      shippingAddress = await prismaClient.address.findFirstOrThrow({
        where: {
          id: validateData.defaultShippingAddress,
        },
      });

      if (shippingAddress.userId !== req.user?.id) {
        throw new BadRequestsException(
          "Address does not belong to user",
          ErrorCode.ADDRESS_DOES_NOT_BELONG
        );
      }
    } catch (error) {
      throw new NotFoundException(
        "Address does not exists",
        ErrorCode.ADDRESS_NOT_FOUND
      );
    }
  }
  if (validateData.defaultBillingAddress) {
    try {
      billingAddress = await prismaClient.address.findFirstOrThrow({
        where: {
          id: validateData.defaultBillingAddress,
        },
      });

      if (billingAddress.userId !== req.user?.id) {
        throw new BadRequestsException(
          "Address does not belong to user",
          ErrorCode.ADDRESS_DOES_NOT_BELONG
        );
      }
    } catch (error) {
      throw new NotFoundException(
        "Address does not exists",
        ErrorCode.ADDRESS_NOT_FOUND
      );
    }
  }

  const updatedUser = await prismaClient.user.update({
    where: {
      id: req.user?.id,
    },
    data: validateData,
  });

  res.status(200).json({ updatedUser });
};

export const listUsers = async (req: Request, res: Response) => {
  const users = await prismaClient.user.findMany({
    skip: +req.query.skip! || 0,
    take: 5,
  });
  res.json(users);
};

export const getUserById = async (req: Request, res: Response) => {
  const user = await prismaClient.user.findFirst({
    where: { id: req.params.id },
    include: {
      addresses: true,
    },
  });
  res.json(user);
};

export const changeUserRole = async (req: Request, res: Response) => {
  const user = await prismaClient.user.update({
    where: { id: req.params.id },
    data: {
      role: req.body.role,
    },
  });
  res.json(user);
};
