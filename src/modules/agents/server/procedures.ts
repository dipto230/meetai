import { z } from "zod";
import { and, eq, getTableColumns, ilike, sql } from "drizzle-orm";

import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, baseProcedure, protectedProcedure } from "@/trpc/init";
import { agentInsertSchema } from "../schemas";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";

export const agentsRouter = createTRPCRouter({

  getOne: baseProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const existingAgent = await db
        .select({
          meetingCount: sql<number>`5`,
          ...getTableColumns(agents),
        })
        .from(agents)
        .where(eq(agents.id, input.id))
        .get(); // return single object

      return existingAgent;
    }),

  getMany: baseProcedure
    .input(z.object({
      page: z.number().default(DEFAULT_PAGE),
      pageSize: z
        .number()
        .min(MIN_PAGE_SIZE)
        .max(MAX_PAGE_SIZE)
        .default(DEFAULT_PAGE_SIZE),
      search: z.string().nullish(),
    }).optional())
    .query(async ({ ctx, input = {} }) => {
      const { search, page = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE } = input;

      const data = await db
        .select({
          meetingCount: sql<number>`5`,
          ...getTableColumns(agents),
        })
        .from(agents)
        .where(
          search ? ilike(agents.name, `%${search}%`) : undefined
        );

      // Optional: simple pagination
      const paginatedData = data.slice((page - 1) * pageSize, page * pageSize);

      return paginatedData;
    }),

  create: protectedProcedure
    .input(agentInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const createdAgent = await db
        .insert(agents)
        .values({
          ...input,
          userId: ctx.auth.user.id,
        })
        .returning();

      return {
        success: true,
        agent: createdAgent[0],
      };
    }),

});
