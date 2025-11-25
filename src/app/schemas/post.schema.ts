import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPost extends Document {
  author: Types.ObjectId;
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

const PostSchema = new Schema<IPost>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    image: { type: String },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    likeCount: { type: Number, default: 0 },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    commentCount: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    visibility: {
      type: String,
      enum: ['public', 'friends', 'only_me'],
      default: 'public'
    }
  },
  { timestamps: true }
);

// Indexes for performance
PostSchema.index({ author: 1, createdAt: -1 });
PostSchema.index({ likeCount: -1 });

const Post = mongoose.model<IPost>('Post', PostSchema);
export default Post;
