import { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import status from 'http-status';
import AppError from '../../errors/AppError';
import { ICreateCommentRequest, IUpdateCommentRequest } from './comment.interface';
import CommentService from './comment.service';

/**
 * Create Comment Controller
 */
const createComment: RequestHandler = catchAsync(async (req, res) => {
  const userId = (req as any).user?.user_id || (req as any).userId;
  const { postId } = req.params;

  if (!userId) {
    throw new AppError(401, 'comments', 'User not authenticated');
  }

  const payload: ICreateCommentRequest = req.body;
  const result = await CommentService.createComment(postId, userId, payload);

  sendResponse(res, {
    status: status.CREATED,
    success: true,
    message: 'Comment created successfully!',
    data: result
  });
});

/**
 * Get Single Comment Controller
 */
const getComment: RequestHandler = catchAsync(async (req, res) => {
  const { commentId } = req.params;

  const result = await CommentService.getCommentById(commentId);

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: 'Comment retrieved successfully!',
    data: result
  });
});

/**
 * Get Post Comments Controller
 */
const getPostComments: RequestHandler = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const { page, limit } = req.query;

  const result = await CommentService.getPostComments(
    postId,
    page ? Number(page) : 1,
    limit ? Number(limit) : 10
  );

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: 'Comments retrieved successfully!',
    meta: result.meta,
    data: result.data
  });
});

/**
 * Get Comment Replies Controller
 */
const getCommentReplies: RequestHandler = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const { page, limit } = req.query;

  const result = await CommentService.getCommentReplies(
    commentId,
    page ? Number(page) : 1,
    limit ? Number(limit) : 10
  );

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: 'Replies retrieved successfully!',
    meta: result.meta,
    data: result.data
  });
});

/**
 * Update Comment Controller
 */
const updateComment: RequestHandler = catchAsync(async (req, res) => {
  const userId = (req as any).user?.user_id || (req as any).userId;
  const { commentId } = req.params;

  if (!userId) {
    throw new AppError(401, 'comments', 'User not authenticated');
  }

  const payload: IUpdateCommentRequest = req.body;
  const result = await CommentService.updateComment(commentId, userId, payload);

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: 'Comment updated successfully!',
    data: result
  });
});

/**
 * Delete Comment Controller
 */
const deleteComment: RequestHandler = catchAsync(async (req, res) => {
  const userId = (req as any).user?.user_id || (req as any).userId;
  const { commentId } = req.params;

  if (!userId) {
    throw new AppError(401, 'comments', 'User not authenticated');
  }

  await CommentService.deleteComment(commentId, userId);

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: 'Comment deleted successfully!',
    data: null
  });
});

/**
 * Toggle Comment Like Controller
 */
const toggleCommentLike: RequestHandler = catchAsync(async (req, res) => {
  const userId = (req as any).user?.user_id || (req as any).userId;
  const { commentId } = req.params;

  if (!userId) {
    throw new AppError(401, 'comments', 'User not authenticated');
  }

  const result = await CommentService.toggleCommentLike(commentId, userId);

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: result.liked ? 'Comment liked!' : 'Comment unliked!',
    data: result
  });
});

/**
 * Get Comment Likes Controller
 */
const getCommentLikes: RequestHandler = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const { page, limit } = req.query;

  const result = await CommentService.getCommentLikes(
    commentId,
    page ? Number(page) : 1,
    limit ? Number(limit) : 20
  );

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: 'Comment likes retrieved successfully!',
    meta: result.meta,
    data: result.data
  });
});

export const CommentController = {
  createComment,
  getComment,
  getPostComments,
  getCommentReplies,
  updateComment,
  deleteComment,
  toggleCommentLike,
  getCommentLikes
};
