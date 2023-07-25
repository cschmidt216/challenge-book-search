const express = require('express');
const { ApolloServer } = require("apollo-server-express");
const path = require('path');
const { typeDefs, resolvers } = require("./schemas"); // Import GraphQL typeDefs and resolvers
const db = require('./config/connection'); // Mongoose database connection
const { authMiddleware } = require('./utils/auth'); // Authentication middleware
const app = express();
const PORT = process.env.PORT || 3001;

// Create Apollo Server with typeDefs, resolvers, and authentication middleware
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware, // Add authentication context to resolve the user
});

// Apply Apollo Server middleware to the Express app
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve the React client application in production from the 'client/build' folder
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Route for all other routes in production to serve the client application
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// Once the database connection is open, start the server and listen on the specified PORT
db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
  console.log(`GraphQL server ready at http://localhost:${PORT}${server.graphqlPath}`);
});