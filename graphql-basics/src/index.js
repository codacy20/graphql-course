import { GraphQLServer } from "graphql-yoga";

// type deffs
const typeDefs = `
    type Query{
        hello: String!
        name: String!
        location: String!
        bio: String!
    }
`;

// resolvers
const resolvers = {
  Query: {
    hello() {
      return "this is my shit";
    },
    name() {
      return "my name is something";
    },
    location() {
      return "my local is blabla";
    },
    bio() {
      return "my biooooooo";
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => {
  console.log("Lets goooo");
});
