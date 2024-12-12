import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bio: {
    type: String,
    maxlength: 250, 
  },
  profilePicture: {
    type: String, 
  },
  website: {
    type: String, 
    match: [/^https?:\/\/.+/, 'Invalid URL'], 
  },
  socialLinks: [
    {
      type: String,
      match: [/^https?:\/\/.+/, 'Invalid URL'], 
    },
  ],
  interests: [
    {
      type: String,
    },
  ],
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public',
  },
  location: {
    type: String,
  },
  followerCount: {
    type: Number,
    default: 0,
  },
  followingCount: {
    type: Number,
    default: 0,
  },
  postCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

profileSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Profile = mongoose.model('Profile',profileSchema)

export default Profile