import { createTRPCRouter } from "./create-context";
import { ordersRouter } from "./routes/orders";
import { merchRouter } from "./routes/merch";
import { heroesRouter } from "./routes/heroes";

export const appRouter = createTRPCRouter({
  orders: ordersRouter,
  merch: merchRouter,
  heroes: heroesRouter,
});

export type AppRouter = typeof appRouter;
