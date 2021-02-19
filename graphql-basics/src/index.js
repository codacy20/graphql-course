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
        title: String!
        price: Float!
        releaseYear: Int
        rating: Float
        inStock: Boolean!
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
      return 227;
    },
    employed() {
      return true;
    },
    gpa() {
      return null;
    },
    title() {
      return "raybans";
    },
    price() {
      return 3000.2;
    },
    releaseYear() {
      return 2020;
    },
    rating() {
      return null;
    },
    inStock() {
      return true;
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => {
  console.log("Lets goooo");
});
