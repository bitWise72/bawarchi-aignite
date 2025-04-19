import mongoose from 'mongoose';

const { Schema } = mongoose;

// User Schema
const UserSchema = new Schema({
  googleId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  picture: { type: String, required: true },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
});

// Use UserSchema here instead of userSchema
const User = mongoose.model('User', UserSchema);

export default User;
