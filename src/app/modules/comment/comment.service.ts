import Comment from '../../schemas/comment.schema';
import Post from '../../schemas/post.schema';
import AppError from '../../errors/AppError';
import LikeService from '../../services/likeService';
import {
  ICreateCommentRequest,
  IUpdateCommentRequest,
  ICommentResponse,
  IPaginationMeta
} from './comment.interface';
import mongoose from 'mongoose';

class CommentService {
  /**
   * Create a new comment
   */
  static async createComment(
    postId: string,
    userId: string,
    payload: ICreateCommentRequest
  ): Promise<ICommentResponse> {
    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      throw new AppError(404, 'comments', 'Post not found');
    }

    const comment = new Comment({
      post: postId,
      author: userId,
      content: payload.content,
      parentComment: payload.parentComment || null
    });

    await comment.save();

    // Increment post comment count
    await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });

    // If replying to comment, increment reply count
    if (payload.parentComment) {
      await Comment.findByIdAndUpdate(payload.parentComment, {
        $addToSet: { replies: comment._id },
        $inc: { replyCount: 1 }
      });
    } else {
      // Add comment to post
      await Post.findByIdAndUpdate(postId, {
        $addToSet: { comments: comment._id }
      });
    }

    return this.formatCommentResponse(comment);
  }

  /**
   * Get single comment by ID
   */
  static async getCommentById(commentId: string): Promise<ICommentResponse> {
    const comment = await Comment.findById(commentId).populate(
      'author',
      'email firstName lastName username profilePicture'
    );

    if (!comment) {
      throw new AppError(404, 'comments', 'Comment not found');
    }

    return this.formatCommentResponse(comment);
  }

  /**
   * Get all comments on a post (top-level only)
   */
  static async getPostComments(
    postId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: ICommentResponse[]; meta: IPaginationMeta }> {
    const skip = (page - 1) * limit;

    const comments = await Comment.find({ post: postId, parentComment: null })
      .populate('author', 'email firstName lastName username profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalData = await Comment.countDocuments({
      post: postId,
      parentComment: null
    });
    const totalPage = Math.ceil(totalData / limit);

    return {
      data: comments.map((comment) => this.formatCommentResponse(comment)),
      meta: {
        page,
        limit,
        totalData,
        totalPage
      }
    };
  }

  /**
   * Get replies to a comment
   */
  static async getCommentReplies(
    commentId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: ICommentResponse[]; meta: IPaginationMeta }> {
    const skip = (page - 1) * limit;

    const replies = await Comment.find({ parentComment: commentId })
      .populate('author', 'email firstName lastName username profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalData = await Comment.countDocuments({
      parentComment: commentId
    });
    const totalPage = Math.ceil(totalData / limit);

    return {
      data: replies.map((reply) => this.formatCommentResponse(reply)),
      meta: {
        page,
        limit,
        totalData,
        totalPage
      }
    };
  }

  /**
   * Update comment
   */
  static async updateComment(
    commentId: string,
    userId: string,
    payload: IUpdateCommentRequest
  ): Promise<ICommentResponse> {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new AppError(404, 'comments', 'Comment not found');
    }

    if (comment.author.toString() !== userId) {
      throw new AppError(403, 'comments', 'You can only update your own comments');
    }

    comment.content = payload.content;
    await comment.save();

    return this.formatCommentResponse(comment);
  }

  /**
   * Delete comment
   */
  static async deleteComment(commentId: string, userId: string): Promise<void> {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new AppError(404, 'comments', 'Comment not found');
    }

    if (comment.author.toString() !== userId) {
      throw new AppError(403, 'comments', 'You can only delete your own comments');
    }

    // Decrement post comment count
    await Post.findByIdAndUpdate(comment.post, {
      $inc: { commentCount: -1 },
      $pull: { comments: commentId }
    });

    // If replying to comment, remove from parent replies
    if (comment.parentComment) {
      await Comment.findByIdAndUpdate(comment.parentComment, {
        $pull: { replies: commentId },
        $inc: { replyCount: -1 }
      });
    }

    await Comment.findByIdAndDelete(commentId);
  }

  /**
   * Toggle like on comment
   */
  static async toggleCommentLike(
    commentId: string,
    userId: string
  ): Promise<{ liked: boolean; likeCount: number }> {
    return LikeService.toggleCommentLike(commentId, userId);
  }

  /**
   * Get comment likes (paginated)
   */
  static async getCommentLikes(
    commentId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: any[]; meta: IPaginationMeta }> {
    const comment = await Comment.findById(commentId).populate('likes');

    if (!comment) {
      throw new AppError(404, 'comments', 'Comment not found');
    }

    const skip = (page - 1) * limit;
    const likes = comment.likes.slice(skip, skip + limit);
    const totalData = comment.likes.length;
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
   * Format comment response
   */
  private static formatCommentResponse(comment: any): ICommentResponse {
    return {
      _id: comment._id,
      post: comment.post,
      author: {
        _id: comment.author._id,
        email: comment.author.email,
        firstName: comment.author.firstName,
        lastName: comment.author.lastName,
        username: comment.author.username,
        profilePicture: comment.author.profilePicture
      },
      content: comment.content,
      parentComment: comment.parentComment,
      likes: comment.likes,
      likeCount: comment.likeCount,
      replies: comment.replies,
      replyCount: comment.replyCount,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt
    };
  }
}

export default CommentService;
