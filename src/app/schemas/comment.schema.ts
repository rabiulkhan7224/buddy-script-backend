import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IComment extends Document {
  post: Types.ObjectId;
  author: Types.ObjectId;
  content: string;
  parentComment?: Types.ObjectId | null;
  likes: Types.ObjectId[];
  likeCount: number;
  replies: Types.ObjectId[];
  replyCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    parentComment: { type: Schema.Types.ObjectId, ref: 'Comment', default: null },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    likeCount: { type: Number, default: 0 },
    replies: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    replyCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Compound index for nested comment loading
CommentSchema.index({ post: 1, createdAt: -1 });
CommentSchema.index({ parentComment: 1, createdAt: 1 });

const Comment = mongoose.model<IComment>('Comment', CommentSchema);
export default Comment;
