import { z } from "zod"
import { eq } from "drizzle-orm"

import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, baseProcedure, protectedProcedure } from "@/trpc/init";
import { agentInsertSchema } from "../schemas";

export const agentsRouter = createTRPCRouter({

  getOne: baseProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    const existingAgent = await db
      .select()
      .from(agents)
      .where(eq(agents.id, input.id))

    return existingAgent;
  }),

  // Fetch all agents
  getMany: baseProcedure.query(async () => {
    const data = await db.select().from(agents);
    return data;
  }),

  // Create a new agent (requires authentication)
  create: protectedProcedure
    .input(agentInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const createdAgent = await db
        .insert(agents)
        .values({
          ...input,
          userId: ctx.auth.user.id, // make sure ctx.auth.user exists
        })
        .returning();

      return createdAgent;
    }),
});
