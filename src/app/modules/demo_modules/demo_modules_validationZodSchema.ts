/**
 * Demo Module Validation Schemas
 * Zod schemas for validating demo module data
 */
import { z } from 'zod';

export const createDemoModuleSchema = z.object({
  body : z.object({
    name: z.string({required_error: 'Name is required'})
      .min(1, 'Name is required')
      .max(100, 'Name cannot exceed 100 characters'),
    description: z.string()
      .max(500, 'Description cannot exceed 500 characters')
      .optional()
  })
});

export const updateDemoModuleSchema = z.object({
  body : z.object({
    name: z.string()
      .max(100, 'Name cannot exceed 100 characters')
      .optional(),
    description: z.string()
      .max(500, 'Description cannot exceed 500 characters')
      .optional()
  })
});

export type TCreateDemoModule = z.infer<typeof createDemoModuleSchema>;
export type TUpdateDemoModule = z.infer<typeof updateDemoModuleSchema>;
