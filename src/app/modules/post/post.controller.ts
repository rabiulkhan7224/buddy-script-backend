import { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import PostService from './post.service';
import status from 'http-status';
import AppError from '../../errors/AppError';
import { ICreatePostRequest, IUpdatePostRequest } from './post.interfece';

/**
 * Create Post Controller
 */
const createPost: RequestHandler = catchAsync(async (req, res) => {
  const userId = (req as any).user?.user_id || (req as any).userId;

  if (!userId) {
    throw new AppError(401, 'posts', 'User not authenticated');
  }

  const payload: ICreatePostRequest = req.body;
  const result = await PostService.createPost(userId, payload);

  sendResponse(res, {
    status: status.CREATED,
    success: true,
    message: 'Post created successfully!',
    data: result
  });
});

/**
 * Get Single Post Controller
 */
const getPost: RequestHandler = catchAsync(async (req, res) => {
  const { postId } = req.params;

  const result = await PostService.getPostById(postId);

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: 'Post retrieved successfully!',
    data: result
  });
});

/**
 * Get All Posts Controller
 */
const getAllPosts: RequestHandler = catchAsync(async (req, res) => {
  const { page, limit, visibility, authorId } = req.query;

  const query = {
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10,
    visibility: visibility as 'public' | 'friends' | 'only_me' | undefined,
    authorId: authorId as string | undefined
  };

  const result = await PostService.getAllPosts(query);

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: 'Posts retrieved successfully!',
    meta: result.meta,
    data: result.data
  });
});

/**
 * Get User Feed Controller
 */
const getUserFeed: RequestHandler = catchAsync(async (req, res) => {
  const userId = (req as any).user?.user_id || (req as any).userId;

  if (!userId) {
    throw new AppError(401, 'posts', 'User not authenticated');
  }

  const { page, limit } = req.query;

  const query = {
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10
  };

  const result = await PostService.getUserPosts(userId, query);

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: 'User feed retrieved successfully!',
    meta: result.meta,
    data: result.data
  });
});

/**
 * Update Post Controller
 */
const updatePost: RequestHandler = catchAsync(async (req, res) => {
  const userId = (req as any).user?.user_id || (req as any).userId;
  const { postId } = req.params;

  if (!userId) {
    throw new AppError(401, 'posts', 'User not authenticated');
  }

  const payload: IUpdatePostRequest = req.body;
  const result = await PostService.updatePost(postId, userId, payload);

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: 'Post updated successfully!',
    data: result
  });
});

/**
 * Delete Post Controller
 */
const deletePost: RequestHandler = catchAsync(async (req, res) => {
  const userId = (req as any).user?.user_id || (req as any).userId;
  const { postId } = req.params;

  if (!userId) {
    throw new AppError(401, 'posts', 'User not authenticated');
  }

  await PostService.deletePost(postId, userId);

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: 'Post deleted successfully!',
    data: null
  });
});

/**
 * Toggle Post Like Controller
 */
const togglePostLike: RequestHandler = catchAsync(async (req, res) => {
  const userId = (req as any).user?.user_id || (req as any).userId;
  const { postId } = req.params;

  if (!userId) {
    throw new AppError(401, 'posts', 'User not authenticated');
  }

  const result = await PostService.togglePostLike(postId, userId);

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: result.liked ? 'Post liked!' : 'Post unliked!',
    data: result
  });
});

/**
 * Get Post Likes Controller
 */
const getPostLikes: RequestHandler = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const { page, limit } = req.query;

  const result = await PostService.getPostLikes(
    postId,
    page ? Number(page) : 1,
    limit ? Number(limit) : 20
  );

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: 'Post likes retrieved successfully!',
    meta: result.meta,
    data: result.data
  });
});

export const PostController = {
  createPost,
  getPost,
  getAllPosts,
  getUserFeed,
  updatePost,
  deletePost,
  togglePostLike,
  getPostLikes
};
