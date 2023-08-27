import * as z from 'zod';

export const PaginationSchema = z.object({
  page: z.number().min(0),
  limit: z.number().max(50).min(1),
});
