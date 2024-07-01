import express, { Request, Response, Express } from "express";
import { PORT } from "./secrets";
import rootRouter from "./routes";
import { PrismaClient } from "@prisma/client";
import { errorMiddleware } from "./middleware/errors";
import { SignUpSchema } from "./schema/users";

const app: Express = express();

app.use(express.json());
app.use("/api", rootRouter);

export const prismaClient = new PrismaClient({ log: ["query"] }).$extends({
  result: {
    address: {
      formattedAddress: {
        needs: {
          type: true,
          street: true,
          city: true,
          country: true,
          postelCode: true,
        },
        compute: (addr) =>
          `${addr.type} on ${addr.street}, ${addr.city}, ${addr.country} postel code: ${addr.postelCode}`,
      },
    },
  },
});

app.use(errorMiddleware);

app.listen(PORT, () => console.log(`Server run: http://localhost:${PORT}`));
