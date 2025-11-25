import { Types } from 'mongoose';

/**
 * Post creation request payload
 */
export interface ICreatePostRequest {
  content: string;
  image?: string;
  visibility?: 'public' | 'friends' | 'only_me';
}

/**
 * Post update request payload
 */
export interface IUpdatePostRequest {
  content?: string;
  image?: string;
  visibility?: 'public' | 'friends' | 'only_me';
}

/**
 * Post response (without sensitive data)
 */
export interface IPostResponse {
  _id: Types.ObjectId;
  author: {
    _id: Types.ObjectId;
    email: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    profilePicture?: string;
  };
  content: string;
  image?: string;
  likes: Types.ObjectId[];
  likeCount: number;
  comments: Types.ObjectId[];
  commentCount: number;
  shares: number;
  visibility: 'public' | 'friends' | 'only_me';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Post list query parameters
 */
export interface IPostListQuery {
  page?: number;
  limit?: number;
  visibility?: 'public' | 'friends' | 'only_me';
  authorId?: string;
}

/**
 * Like toggle response
 */
export interface ILikeResponse {
  liked: boolean;
  likeCount: number;
}

/**
 * Paginated response metadata
 */
export interface IPaginationMeta {
  page: number;
  limit: number;
  totalData: number;
  totalPage: number;
}
