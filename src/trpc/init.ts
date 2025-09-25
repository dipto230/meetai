// src/trpc/init.ts
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { initTRPC, TRPCError } from '@trpc/server'

// Context for TRPC
export const createTRPCContext = async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: 'user_123' }
}

// Create TRPC instance
const t = initTRPC.create({
  // transformer: superjson, // uncomment if you use superjson
})

// Base helpers
export const createTRPCRouter = t.router
export const createCallerFactory = t.createCallerFactory
export const baseProcedure = t.procedure

// Protected procedure
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  // ✅ await headers()
  const h = await headers()

  const session = await auth.api.getSession({
    headers: h,
  })

  if (!session) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' })
  }

  return next({
    ctx: {
      ...ctx,
      auth: session,
    },
  })
})
