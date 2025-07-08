// models/User.js
import "dotenv/config"
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function (email) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
      },
      message: 'Please enter a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profilePicture: {
    type: String,
    default: '' // URL to profile image
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  refreshToken: {
    type: String,

  },
  isGoogleUser: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: { type: String },
  resetPasswordExpiry: { type: Date },


}, {
  timestamps: true // adds createdAt and updatedAt automatically
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.generateAccessToken = function () { // error - use "function" keyword to make function when we use "this"
  return jwt.sign({
    _id: this._id,
    email: this.email,
    username: this.username,

  },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({
    _id: this._id,

  },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

export const User = mongoose.model('User', userSchema);



