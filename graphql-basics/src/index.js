import { GraphQLServer } from "graphql-yoga";

// Scalar types: String, Boolean, Int, Float, ID,
// non Scalar types: String, Boolean, Int, Float, ID,

// type deffs
const typeDefs = `
    type Query{
        id: ID!
        name: String!
        age: Int!
        employed: Boolean!
        gpa: Float
    }
`;

// resolvers
const resolvers = {
  Query: {
    id() {
      return "abc";
    },
    name() {
      return "this guy";
    },
    age() {
      return 27;
    },
    employed() {
      return true;
    },
    gpa() {
      return null;
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => {
  console.log("Lets goooo");
});
