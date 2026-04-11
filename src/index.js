require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');

const typeDefs = require('./schema/typeDefs');
const resolvers = require('./resolvers');

const DB_NAME = process.env.DB_NAME || "comp3133_101504303_Assigment1";
const DB_USER_NAME = process.env.DB_USER_NAME || "uzma_db_user";
const DB_PASSWORD = process.env.DB_PASSWORD || "h2UiwgTbXxAJJbpk";
const CLUSTER_ID = process.env.CLUSTER_ID || "w2wmqnu";

const DB_CONNECTION =
  `mongodb+srv://${DB_USER_NAME}:${DB_PASSWORD}` +
  `@cluster0.${CLUSTER_ID}.mongodb.net/${DB_NAME}` +
  `?retryWrites=true&w=majority&appName=Cluster0`;

const PORT = process.env.PORT || 4000;

async function start() {
  const app = express();
  app.use(cors());

  // Health check endpoint
  app.get('/', (req, res) => {
    res.json({ message: 'COMP3133 Assignment 1 API is running', graphql: '/graphql' });
  });

  const server = new ApolloServer({
    typeDefs,
    resolvers
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  mongoose
    .connect(DB_CONNECTION)
    .then(() => {
      console.log('Connected to MongoDB');
      app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}${server.graphqlPath}`);
      });
    })
    .catch(err => console.error('Mongo error:', err.message));
}

start();
