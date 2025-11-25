import { Types } from 'mongoose';

/**
 * Create comment request payload
 */
export interface ICreateCommentRequest {
  content: string;
  parentComment?: string;
}

/**
 * Update comment request payload
 */
export interface IUpdateCommentRequest {
  content: string;
}

/**
 * Comment response (without sensitive data)
 */
export interface ICommentResponse {
  _id: Types.ObjectId;
  post: Types.ObjectId;
  author: {
    _id: Types.ObjectId;
    email: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    profilePicture?: string;
  };
  content: string;
  parentComment?: Types.ObjectId | null;
  likes: Types.ObjectId[];
  likeCount: number;
  replies: Types.ObjectId[];
  replyCount: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Pagination metadata
 */
export interface IPaginationMeta {
  page: number;
  limit: number;
  totalData: number;
  totalPage: number;
}
