const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      // Check if the user is logged in
      if (context.user) {
        // Fetch user data, excluding sensitive fields
        const data = await User.findOne({ _id: context.user._id }).select('-__v -password');
        return data;
      }
      // If not logged in, throw an authentication error
      throw new AuthenticationError('You need to be logged in!');
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      // Create a new user
      const user = await User.create({ username, email, password });
      // Sign a token for the newly created user
      const token = signToken(user);
      return { token, user };
    },

    login: async (parent, { email, password }) => {
      // Find the user with the provided email
      const user = await User.findOne({ email });

      // If user not found, throw an authentication error
      if (!user) {
        throw new AuthenticationError('User not found. Do you have an account?');
      }

      // Check if the password is correct using the user's method
      const correctPw = await user.isCorrectPassword(password);

      // If the password is incorrect, throw an authentication error
      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials!');
      }

      // Sign a token for the authenticated user
      const token = signToken(user);
      return { token, user };
    },

    saveBook: async (parent, { newBook }, context) => {
      // Check if the user is logged in
      if (context.user) {
        // Add the new book to the user's savedBooks array
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: newBook } },
          { new: true }
        );
        return updatedUser;
      }
      // If not logged in, throw an authentication error
      throw new AuthenticationError('You need to be logged in!');
    },

    removeBook: async (parent, { bookId }, context) => {
      // Check if the user is logged in
      if (context.user) {
        // Remove the book with the given bookId from the user's savedBooks array
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        return updatedUser;
      }
      // If not logged in, throw an authentication error
      throw new AuthenticationError('Login required!');
    },
  },
};

module.exports = resolvers;