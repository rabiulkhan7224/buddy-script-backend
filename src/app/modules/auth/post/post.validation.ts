import { z } from 'zod';

const createPostValidationSchema = z.object({
  body: z.object({
    content: z
      .string({
        required_error: 'Content is required',
        invalid_type_error: 'Content must be a string'
      })
      .min(1, 'Content cannot be empty')
      .max(5000, 'Content must be less than 5000 characters'),
    image: z.string().url('Invalid image URL').optional(),
    visibility: z
      .enum(['public', 'friends', 'only_me'], {
        errorMap: () => ({
          message: 'Visibility must be public, friends, or only_me'
        })
      })
      .optional()
  })
});

const updatePostValidationSchema = z.object({
  body: z.object({
    content: z
      .string()
      .min(1, 'Content cannot be empty')
      .max(5000, 'Content must be less than 5000 characters')
      .optional(),
    image: z.string().url('Invalid image URL').optional(),
    visibility: z
      .enum(['public', 'friends', 'only_me'], {
        errorMap: () => ({
          message: 'Visibility must be public, friends, or only_me'
        })
      })
      .optional()
  })
});

const paginationValidationSchema = z.object({
  query: z.object({
    page: z
      .string()
      .regex(/^\d+$/, 'Page must be a number')
      .transform(Number)
      .refine((n) => n > 0, 'Page must be greater than 0')
      .optional(),
    limit: z
      .string()
      .regex(/^\d+$/, 'Limit must be a number')
      .transform(Number)
      .refine((n) => n > 0 && n <= 100, 'Limit must be between 1 and 100')
      .optional()
  })
});

export const PostValidation = {
  createPostValidationSchema,
  updatePostValidationSchema,
  paginationValidationSchema
};
