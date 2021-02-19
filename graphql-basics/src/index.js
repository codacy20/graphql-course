import { GraphQLServer } from "graphql-yoga";

// Scalar types: String, Boolean, Int, Float, ID,
// non Scalar types: String, Boolean, Int, Float, ID,

// type deffs
const typeDefs = `
    type Query{
        me: User!
        post: Post
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post{
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }
`;

// resolvers
const resolvers = {
  Query: {
    me() {
      return { id: "123", name: "mike", email: "email@me.com" };
    },
    post() {
      return {
        id: "987",
        title: "this is a title",
        body: "body is here",
        published: false,
      };
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => {
  console.log("Lets goooo");
});
