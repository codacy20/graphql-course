import { GraphQLServer } from "graphql-yoga";
import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import User from "./resolvers/User";
import Post from "./resolvers/Post";
import Comment from "./resolvers/Comment";
import db from "./db";
// Scalar types: String, Boolean, Int, Float, ID,
// non Scalar types: String, Boolean, Int, Float, ID,

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: {
    User,
    Comment,
    Post,
    Query,
    Mutation,
  },
  context: {
    db,
  },
});
server.start(() => {
  console.log("Lets goooo");
});
