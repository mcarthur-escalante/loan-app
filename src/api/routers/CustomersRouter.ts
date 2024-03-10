import { publicProcedure, trpc } from '../trpc';
import { z } from 'zod';
import { CustomerSchema } from '../../core/domain/model';
import { CustomerRepository } from '../../core/domain/repositories';

export const customersRouter = trpc.router({
  getAllCustomers: publicProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/customers',
        tags: ['Customers'],
        summary: 'Get all Customers',
      },
    })
    .input(z.object({}))
    .output(z.array(CustomerSchema))
    .query((_) => CustomerRepository.getAllCustomers()),
});
