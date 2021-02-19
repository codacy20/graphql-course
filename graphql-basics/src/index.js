import { GraphQLServer } from "graphql-yoga";

// type deffs
const typeDefs = `
    type Query{
        hello: String
    }
`;

// resolvers
const resolvers = {
  Query: {
    hello() {
      return "this is my shit";
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => {
  console.log("Lets goooo");
});
