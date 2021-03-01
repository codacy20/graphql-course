import { GraphQLServer } from "graphql-yoga";
import { v4 as uuidv4 } from "uuid";
// Scalar types: String, Boolean, Int, Float, ID,
// non Scalar types: String, Boolean, Int, Float, ID,

// Demo user data

const users = [
  { id: "1", name: "Andrew", email: "me@me.com", age: 20 },
  { id: "2", name: "Amir", email: "me@me.com", age: 22 },
  { id: "3", name: "jeff", email: "me@me.com", age: 23 },
];

const comments = [
  {
    id: "1",
    text: "comment comment comment comment comment comment",
    author: "1",
    post: "1",
  },
  {
    id: "2",
    text: "comment comment comment comment",
    author: "2",
    post: "2",
  },
  { id: "3", text: "comment comment", author: "1", post: "2" },
  { id: "4", text: "comment", author: "2", post: "3" },
];

const posts = [
  {
    id: "1",
    title: "title 1",
    body: "me@me.com",
    published: true,
    author: "1",
    comments: ["1", "2", "4"],
  },
  {
    id: "2",
    title: "title 2",
    body: "me@me.com",
    published: true,
    author: "1",
    comments: ["3"],
  },
  {
    id: "3",
    title: "title 3",
    body: "me@me.com",
    published: false,
    author: "2",
  },
];

// type deffs
const typeDefs = `
    type Query{
        me: User!
        post: Post
        users(query:String): [User!]!
        posts(query:String): [Post!]!
        comments(query:String): [Comment!]!
    }

    type Mutation{
      createUser(name: String!, email: String!, age: Int): User!
      createPost(title:String!,body:String!,published:Boolean!,author:String!): Post!
      createComment(text:String!,author:String!,post:String!): Comment!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post{
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Comment{
      id: ID!
      text: String!
      author: User!
      post: Post!
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
          post.body.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
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
    comments(parent, args, ctx, info) {
      return comments;
    },
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some((user) => {
        console.log(user);
        return user.email === args.email;
      });
      if (emailTaken) throw new Error("Email has been taken.");
      const user = {
        id: uuidv4(),
        name: args.name,
        email: args.email,
        age: args.age,
      };
      users.push(user);
      return user;
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.author);

      if (!userExists) {
        throw new Error("User not found!");
      }

      const newPost = {
        id: uuidv4(),
        title: args.title,
        body: args.body,
        published: args.published,
        author: args.author,
      };

      posts.push(newPost);

      return newPost;
    },
    createComment(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.author);
      const publishedPostExists = posts.some(
        (post) => post.id === args.post && post.published
      );

      if (!userExists) {
        throw new Error("User doesnt exists!");
      }

      if (!publishedPostExists) {
        throw new Error("Published post doesnt exists!");
      }

      const newComment = {
        text: args.text,
        id: uuidv4(),
        author: args.author,
        post: args.post,
      };

      comments.push(newComment);
      return newComment;
    },
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return parent.author === user.id;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.post === parent.id;
      });
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => {
        return parent.id === post.author;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.author === parent.id;
      });
    },
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
    post(parent, args, ctx, info) {
      return posts.find((post) => {
        return parent.post === post.id;
      });
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => {
  console.log("Lets goooo");
});
