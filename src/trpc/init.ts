// src/trpc/init.ts
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { initTRPC, TRPCError } from '@trpc/server'; // ✅ import TRPCError
// Remove `cache` here; use normal async function
export const createTRPCContext = async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: 'user_123' };
};

// Avoid exporting the entire t-object
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  // Use headers() inside the procedure, not in cached context
  const session = await auth.api.getSession({
    headers: headers(), // ✅ ensure fresh headers per request
  });

  if (!session) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
  }

  return next({
    ctx: {
      ...ctx,
      auth: session
    }
  });
});
