import { GraphQLServer } from "graphql-yoga";

// Scalar types: String, Boolean, Int, Float, ID,
// non Scalar types: String, Boolean, Int, Float, ID,

// Demo user data

const users = [
  { id: "1", name: "Andrew", email: "me@me.com", age: 20 },
  { id: "2", name: "Amir", email: "me@me.com", age: 22 },
  { id: "3", name: "jeff", email: "me@me.com", age: 23 },
];

const posts = [
  { id: "1", title: "title 1", body: "me@me.com", published: true },
  { id: "2", title: "title 2", body: "me@me.com", published: true },
  { id: "3", title: "title 3", body: "me@me.com", published: false },
];

// type deffs
const typeDefs = `
    type Query{
        me: User!
        post: Post
        users(query:String): [User!]!
        posts(query:String): [Post!]!
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
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }
      return users.filter((user) => {
        return user.name
          .toLocaleLowerCase()
          .includes(args.query.toLocaleLowerCase());
      });
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }
      return posts.filter((post) => {
        return (
          post.title
            .toLocaleLowerCase()
            .includes(args.query.toLocaleLowerCase()) ||
          post.body
            .toLocaleLowerCase()
            .includes(args.query.toLocaleLowerCase())
        );
      });
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
