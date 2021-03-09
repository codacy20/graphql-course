import { GraphQLServer, PubSub } from "graphql-yoga";
import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import Subscription from "../src/resolvers/Subscription";
import User from "./resolvers/User";
import Post from "./resolvers/Post";
import Comment from "./resolvers/Comment";
import db from "./db";
// Scalar types: String, Boolean, Int, Float, ID,
// non Scalar types: String, Boolean, Int, Float, ID,

export const pubSub = new PubSub();

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: {
    User,
    Comment,
    Post,
    Subscription,
    Query,
    Mutation,
  },
  context: {
    db,
    pubSub,
  },
});
server.start(() => {
  console.log("Lets goooo");
});
