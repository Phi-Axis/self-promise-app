import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  promises: router({
    getTodayPromise: protectedProcedure.query(({ ctx }) =>
      db.getTodayPromise(ctx.user.id)
    ),

    create: protectedProcedure
      .input(z.object({
        promiseText: z.string().min(1).max(500),
      }))
      .mutation(({ ctx, input }) =>
        db.createPromise({
          userId: ctx.user.id,
          promiseText: input.promiseText,
          status: "active",
        })
      ),

    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["empty", "active", "checked", "archived"]),
        reflectionText: z.string().optional(),
      }))
      .mutation(({ input }) =>
        db.updatePromiseStatus(input.id, input.status, input.reflectionText)
      ),

    getArchived: protectedProcedure.query(({ ctx }) =>
      db.getArchivedPromises(ctx.user.id)
    ),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) =>
        db.deletePromise(input.id)
      ),
  }),

  settings: router({
    get: protectedProcedure.query(({ ctx }) =>
      db.getUserSettings(ctx.user.id)
    ),

    update: protectedProcedure
      .input(z.object({
        notificationEnabled: z.boolean().optional(),
        notificationTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
      }))
      .mutation(({ ctx, input }) =>
        db.createOrUpdateSettings(ctx.user.id, input)
      ),
  }),
});

export type AppRouter = typeof appRouter;
