import Post from '../../schemas/post.schema';
import User from '../../schemas/user.schema';
import AppError from '../../errors/AppError';
import LikeService from '../../services/likeService';
import {
  ICreatePostRequest,
  IUpdatePostRequest,
  IPostResponse,
  IPostListQuery,
  IPaginationMeta
} from './post.interfece';

class PostService {
  /**
   * Create a new post
   */
  static async createPost(
    userId: string,
    payload: ICreatePostRequest
  ): Promise<IPostResponse> {
    const post = new Post({
      author: userId,
      content: payload.content,
      image: payload.image,
      visibility: payload.visibility || 'public'
    });

    await post.save();
    return this.formatPostResponse(post);
  }

  /**
   * Get single post by ID
   */
  static async getPostById(postId: string): Promise<IPostResponse> {
    const post = await Post.findById(postId).populate(
      'author',
      'email firstName lastName username profilePicture'
    );

    if (!post) {
      throw new AppError(404, 'posts', 'Post not found');
    }

    return this.formatPostResponse(post);
  }

  /**
   * Get all posts with pagination
   */
  static async getAllPosts(
    query: IPostListQuery
  ): Promise<{ data: IPostResponse[]; meta: IPaginationMeta }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = { visibility: { $in: ['public', 'friends'] } };
    if (query.visibility) {
      filter.visibility = query.visibility;
    }
    if (query.authorId) {
      filter.author = query.authorId;
    }

    // Fetch posts
    const posts = await Post.find(filter)
      .populate('author', 'email firstName lastName username profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count
    const totalData = await Post.countDocuments(filter);
    const totalPage = Math.ceil(totalData / limit);

    return {
      data: posts.map((post) => this.formatPostResponse(post)),
      meta: {
        page,
        limit,
        totalData,
        totalPage
      }
    };
  }

  /**
   * Get posts by user ID (user's own posts + their feed)
   */
  static async getUserPosts(
    userId: string,
    query: IPostListQuery
  ): Promise<{ data: IPostResponse[]; meta: IPaginationMeta }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const filter: any = {
      $or: [
        { author: userId },
        { visibility: { $in: ['public', 'friends'] } }
      ]
    };

    const posts = await Post.find(filter)
      .populate('author', 'email firstName lastName username profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalData = await Post.countDocuments(filter);
    const totalPage = Math.ceil(totalData / limit);

    return {
      data: posts.map((post) => this.formatPostResponse(post)),
      meta: {
        page,
        limit,
        totalData,
        totalPage
      }
    };
  }

  /**
   * Update post
   */
  static async updatePost(
    postId: string,
    userId: string,
    payload: IUpdatePostRequest
  ): Promise<IPostResponse> {
    const post = await Post.findById(postId);

    if (!post) {
      throw new AppError(404, 'posts', 'Post not found');
    }

    if (post.author.toString() !== userId) {
      throw new AppError(403, 'posts', 'You can only update your own posts');
    }

    // Update fields
    if (payload.content) post.content = payload.content;
    if (payload.image) post.image = payload.image;
    if (payload.visibility) post.visibility = payload.visibility;

    await post.save();
    return this.formatPostResponse(post);
  }

  /**
   * Delete post
   */
  static async deletePost(postId: string, userId: string): Promise<void> {
    const post = await Post.findById(postId);

    if (!post) {
      throw new AppError(404, 'posts', 'Post not found');
    }

    if (post.author.toString() !== userId) {
      throw new AppError(403, 'posts', 'You can only delete your own posts');
    }

    await Post.findByIdAndDelete(postId);
  }

  /**
   * Toggle like on post
   */
  static async togglePostLike(
    postId: string,
    userId: string
  ): Promise<{ liked: boolean; likeCount: number }> {
    return LikeService.togglePostLike(postId, userId);
  }

  /**
   * Get post likes (paginated)
   */
  static async getPostLikes(
    postId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: any[]; meta: IPaginationMeta }> {
    const post = await Post.findById(postId).populate('likes');

    if (!post) {
      throw new AppError(404, 'posts', 'Post not found');
    }

    const skip = (page - 1) * limit;
    const likes = post.likes.slice(skip, skip + limit);
    const totalData = post.likes.length;
    const totalPage = Math.ceil(totalData / limit);

    return {
      data: likes,
      meta: {
        page,
        limit,
        totalData,
        totalPage
      }
    };
  }

  /**
   * Format post response with populated author
   */
  private static formatPostResponse(post: any): IPostResponse {
    return {
      _id: post._id,
      author: {
        _id: post.author._id,
        email: post.author.email,
        firstName: post.author.firstName,
        lastName: post.author.lastName,
        username: post.author.username,
        profilePicture: post.author.profilePicture
      },
      content: post.content,
      image: post.image,
      likes: post.likes,
      likeCount: post.likeCount,
      comments: post.comments,
      commentCount: post.commentCount,
      shares: post.shares,
      visibility: post.visibility,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt
    };
  }
}

export default PostService;
