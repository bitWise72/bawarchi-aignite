import mongoose from 'mongoose';

const { Schema } = mongoose;

// Comment sub-schema
const CommentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  commentText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Post Schema with Likes and Comments
const PostSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  picture: { type: String, required: true },
  posts: { type: Schema.Types.Mixed, required: true }, // You may want to change this for better structure.
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Array of User references
  comments: [CommentSchema], // Array of Comment sub-documents
  createdAt: { type: Date, default: Date.now },
});

// Creating the Post model
export default mongoose.model('Post', PostSchema);
