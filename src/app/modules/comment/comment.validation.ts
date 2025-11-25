import { z } from 'zod';

const createCommentValidationSchema = z.object({
  body: z.object({
    content: z
      .string({
        required_error: 'Content is required',
        invalid_type_error: 'Content must be a string'
      })
      .min(1, 'Content cannot be empty')
      .max(2000, 'Content must be less than 2000 characters'),
    parentComment: z.string().optional()
  })
});

const updateCommentValidationSchema = z.object({
  body: z.object({
    content: z
      .string()
      .min(1, 'Content cannot be empty')
      .max(2000, 'Content must be less than 2000 characters')
  })
});

export const CommentValidation = {
  createCommentValidationSchema,
  updateCommentValidationSchema
};
