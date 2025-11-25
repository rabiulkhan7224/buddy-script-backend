import mongoose from 'mongoose';
import Post from '../schemas/post.schema';
import Comment from '../schemas/comment.schema';
import AppError from '../errors/AppError';

class LikeService {
  static async togglePostLike(postId: string, userId: string) {
    const post = await Post.findById(postId).select('likes likeCount');
    if (!post) throw new AppError(404, 'posts', 'Post not found');

    const userObjId = new mongoose.Types.ObjectId(userId);
    const isLiked = post.likes.some((id) => id.toString() === userId);

    if (isLiked) {
      const updated = await Post.findByIdAndUpdate(
        postId,
        { $pull: { likes: userObjId }, $inc: { likeCount: -1 } },
        { new: true }
      ).select('likeCount');

      return { liked: false, likeCount: updated?.likeCount ?? Math.max(post.likeCount - 1, 0) };
    } else {
      const updated = await Post.findByIdAndUpdate(
        postId,
        { $addToSet: { likes: userObjId }, $inc: { likeCount: 1 } },
        { new: true }
      ).select('likeCount');

      return { liked: true, likeCount: updated?.likeCount ?? post.likeCount + 1 };
    }
  }

  static async toggleCommentLike(commentId: string, userId: string) {
    const comment = await Comment.findById(commentId).select('likes likeCount');
    if (!comment) throw new AppError(404, 'comments', 'Comment not found');

    const userObjId = new mongoose.Types.ObjectId(userId);
    const isLiked = comment.likes.some((id) => id.toString() === userId);

    if (isLiked) {
      const updated = await Comment.findByIdAndUpdate(
        commentId,
        { $pull: { likes: userObjId }, $inc: { likeCount: -1 } },
        { new: true }
      ).select('likeCount');

      return { liked: false, likeCount: updated?.likeCount ?? Math.max(comment.likeCount - 1, 0) };
    } else {
      const updated = await Comment.findByIdAndUpdate(
        commentId,
        { $addToSet: { likes: userObjId }, $inc: { likeCount: 1 } },
        { new: true }
      ).select('likeCount');

      return { liked: true, likeCount: updated?.likeCount ?? comment.likeCount + 1 };
    }
  }
}

export default LikeService;