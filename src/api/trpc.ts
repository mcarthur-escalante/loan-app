import { sampleDatabase, User } from '../core/domain/repositories';
import { v4 as uuid } from 'uuid';
import { initTRPC, TRPCError } from '@trpc/server';
import { OpenApiMeta } from 'trpc-openapi';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import jwt from 'jsonwebtoken';

export type Context = {
  user: User | null;
  requestId: string;
};

export const jwtSecret = uuid();

export const trpc = initTRPC
  .context<Context>()
  .meta<OpenApiMeta>()
  .create({
    errorFormatter: ({ error, shape }) => {
      console.error(error);
      if (
        error.code === 'INTERNAL_SERVER_ERROR' &&
        process.env.NODE_ENV === 'production'
      ) {
        return { ...shape, message: 'Internal server error' };
      }
      return shape;
    },
  });

export const publicProcedure = trpc.procedure;

export const protectedProcedure = trpc.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      message: 'User not found',
      code: 'UNAUTHORIZED',
    });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

export async function createContext({
  req,
  res,
}: CreateExpressContextOptions): Promise<Context> {
  const requestId = uuid();
  res.setHeader('x-request-id', requestId);

  let user: User | null = null;

  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      const userId = jwt.verify(token, jwtSecret) as string;
      if (userId) {
        user =
          sampleDatabase.users.find((_user) => _user.id === userId) ?? null;
      }
    }
  } catch (cause) {
    console.error(cause);
  }

  return { user, requestId };
}
