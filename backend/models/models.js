'use strict';
// Maybe we have to use schema
import mongoose from 'mongoose';

// Not sure how to use Token
const TokenSchema = new mongoose.Schema({
  userId: {
    type: String
  },
  token: {
    type: String
  },
  createdAt: {
    type: Date
  }
});

const UserSchema = new mongoose.Schema({
  username: {
    type: String
  },
  fname: {
    type: String
  },
  lname: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  pictureURL: {
    type: String
  },
  Project: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    }
  ],
  preferences: [
    {
      type: String
    }
  ]
});

const QuoteSchema = new mongoose.Schema({
  content: {
    type: String
  },
  createdBy: {
    type: String
  }
});

const PostSchema = new mongoose.Schema({
  content: {
    type: String
  },
  createdAt: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  tags: [
    {
      type: String,
    }
  ],
  comments: [
    {
      content: {
        type: String
      },
      createdAt: {
        type: Date
      },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      likes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
      ]
    }
  ],
  commentNumber: {
    type: Number
  }
});


const TagSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Posts'
    }
  ]
});

const Token = mongoose.model('Token', TokenSchema);
const User = mongoose.model('User', UserSchema);
const Quote = mongoose.model('Quote', QuoteSchema);
const Post = mongoose.model('Post', PostSchema);
const Tag = mongoose.model('Tag', TagSchema);

module.exports = {
  Token: Token,
  User: User,
  Quote: Quote,
  Post: Post,
  Tag: Tag
};
