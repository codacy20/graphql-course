import { GraphQLServer } from "graphql-yoga";
import { v4 as uuidv4 } from "uuid";
import db from "./db";
// Scalar types: String, Boolean, Int, Float, ID,
// non Scalar types: String, Boolean, Int, Float, ID,

// Demo user data

// resolvers
const resolvers = {
  Query: {
    me() {
      return { id: "123", name: "mike", email: "email@me.com" };
    },
    users(parent, args, { db }, info) {
      if (!args.query) {
        return db.users;
      }
      return db.users.filter((user) => {
        return user.name
          .toLocaleLowerCase()
          .includes(args.query.toLocaleLowerCase());
      });
    },
    posts(parent, args, { db }, info) {
      if (!args.query) {
        return db.posts;
      }
      return db.posts.filter((post) => {
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
    comments(parent, args, { db }, info) {
      return db.comments;
    },
  },
  Mutation: {
    createUser(parent, args, { db }, info) {
      const emailTaken = db.users.some((user) => {
        return user.email === args.data.email;
      });

      if (emailTaken) throw new Error("Email has been taken.");

      const user = {
        id: uuidv4(),
        ...args.data,
      };
      db.users.push(user);
      return user;
    },
    deleteUser(parent, args, { db }, info) {
      const userIndex = db.users.findIndex((user) => user.id === args.id);

      if (userIndex === -1) throw new Error("User not found!");

      const deletedUser = db.users.splice(userIndex, 1);
      db.posts = db.posts.filter((post) => {
        const match = post.author === args.id;

        if (match) {
          db.comments = db.comments.filter((comment) => {
            return comment.post !== post.id;
          });
        }
        return !match;
      });

      db.comments = db.comments.filter((comment) => {
        return comment.author !== args.id;
      });

      return deletedUser[0];
    },
    deletePost(parent, args, { db }, info) {
      const postIndex = db.posts.findIndex((post) => post.id === args.id);

      if (postIndex === -1) throw new Error("Post with this Id was not found!");

      const deletedPost = db.posts.splice(postIndex, 1);

      db.comments = db.comments.filter(
        (comment) => !(comment.post === deletedPost[0].id)
      );

      return deletedPost[0];
    },
    createPost(parent, args, { db }, info) {
      const userExists = db.users.some((user) => user.id === args.data.author);

      if (!userExists) {
        throw new Error("User not found!");
      }

      const newPost = {
        id: uuidv4(),
        ...args.data,
      };

      db.posts.push(newPost);

      return newPost;
    },
    deleteComment(parent, args, { db }, info) {
      const commentIndex = db.comments.findIndex(
        (comment) => comment.id === args.id
      );

      if (commentIndex === -1) throw new Error("no comment was found");

      const deletedComment = db.comments.splice(commentIndex, 1);

      return deletedComment[0];
    },
    createComment(parent, args, { db }, info) {
      const userExists = db.users.some((user) => user.id === args.data.author);
      const publishedPostExists = db.posts.some(
        (post) => post.id === args.data.post && post.published
      );

      if (!userExists) {
        throw new Error("User doesnt exists!");
      }

      if (!publishedPostExists) {
        throw new Error("Published post doesnt exists!");
      }

      const newComment = {
        id: uuidv4(),
        ...args.data,
      };

      db.comments.push(newComment);
      return newComment;
    },
  },
  Post: {
    author(parent, args, { db }, info) {
      return db.users.find((user) => {
        return parent.author === user.id;
      });
    },
    comments(parent, args, ctx, info) {
      return db.comments.filter((comment) => {
        return comment.post === parent.id;
      });
    },
  },
  User: {
    posts(parent, args, { db }, info) {
      return db.posts.filter((post) => {
        return parent.id === post.author;
      });
    },
    comments(parent, args, { db }, info) {
      return db.comments.filter((comment) => {
        return comment.author === parent.id;
      });
    },
  },
  Comment: {
    author(parent, args, { db }, info) {
      return db.users.find((user) => {
        return user.id === parent.author;
      });
    },
    post(parent, args, { db }, info) {
      return db.posts.find((post) => {
        return parent.post === post.id;
      });
    },
  },
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: {
    db,
  },
});
server.start(() => {
  console.log("Lets goooo");
});
