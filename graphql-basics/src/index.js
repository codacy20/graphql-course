import { GraphQLServer } from "graphql-yoga";

// Scalar types: String, Boolean, Int, Float, ID,
// non Scalar types: String, Boolean, Int, Float, ID,

// type deffs
const typeDefs = `
    type Query{
        me: User!
        post: Post
        greeting(name: String, position: String): String!
        add(numbers:[Float!]!):Float!
        grades:[Int!]!
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
    greeting(parent, args, ctx, info) {
      console.log(args);
      if (args.name && args.position)
        return `Hi! ${args.name}, you are my fave ${args.position}`;
      else return "Hi!";
    },
    grades(parent, args, ctx, info) {
      return [99, 80, 93];
    },
    add(parent, args, ctx, info) {
      if (args.numbers.length > 0) {
        return args.numbers.reduce((acc, curr) => {
          return acc + curr;
        });
      }
      return 0;
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
