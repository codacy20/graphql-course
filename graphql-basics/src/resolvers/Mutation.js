import { v4 as uuidv4 } from "uuid";

const Mutation = {
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
  updateUser(parent, { id, data }, { db }, info) {
    const user = db.users.find((user) => user.id === id);

    if (!user) throw new Error("User not found");

    if (typeof data.email === "string") {
      const emailTaken = db.users.some((user) => user.email === data.email);
      if (emailTaken) throw new Error("Email taken");
      user.email = data.email;
    }
    if (typeof data.name === "string") {
      user.name = data.name;
    }

    if (typeof data.age !== "undefined") {
      user.age = data.age;
    }
    return user;
  },
  deletePost(parent, args, { db, pubSub }, info) {
    const postIndex = db.posts.findIndex((post) => post.id === args.id);

    if (postIndex === -1) throw new Error("Post with this Id was not found!");

    const [deletedPost] = db.posts.splice(postIndex, 1);

    db.comments = db.comments.filter(
      (comment) => !(comment.post === deletedPost.id)
    );

    if (deletedPost.published) {
      pubSub.publish(`post`, {
        post: { mutation: "DELETED", data: deletedPost },
      });
    }

    return deletedPost;
  },
  createPost(parent, args, { db, pubSub }, info) {
    const userExists = db.users.some((user) => user.id === args.data.author);

    if (!userExists) {
      throw new Error("User not found!");
    }

    const newPost = {
      id: uuidv4(),
      ...args.data,
    };

    db.posts.push(newPost);
    if (newPost.published) {
      pubSub.publish(`post`, {
        post: { mutation: "CREATED", data: newPost },
      });
    }

    return newPost;
  },
  updatePost(
    parent,
    { id, data: { title, body, published } },
    { db, pubSub },
    info
  ) {
    const post = db.posts.find((post) => post.id === id);
    const orginalPost = { ...post };
    if (!post) throw new Error("Post not found");

    if (typeof title === "string") {
      post.title = title;
    }
    if (typeof body === "string") {
      post.body = body;
    }

    if (typeof published === "boolean") {
      post.published = published;
      if (!orginalPost.published && post.published) {
        pubSub.publish(`post`, {
          post: { mutation: "CREATED", data: post },
        });
      } else if (orginalPost.published && !post.published) {
        pubSub.publish(`post`, {
          post: { mutation: "DELETED", data: orginalPost },
        });
      }
    } else if (post.published) {
      pubSub.publish(`post`, {
        post: { mutation: "UPDATED", data: post },
      });
    }
    return post;
  },
  deleteComment(parent, args, { db }, info) {
    const commentIndex = db.comments.findIndex(
      (comment) => comment.id === args.id
    );

    if (commentIndex === -1) throw new Error("no comment was found");

    const deletedComment = db.comments.splice(commentIndex, 1);

    return deletedComment[0];
  },
  createComment(parent, args, { db, pubSub }, info) {
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
    pubSub.publish(`comment ${args.data.post}`, { comment: newComment });
    return newComment;
  },
  updateComment(parent, { id, data: { text, author, post } }, { db }, info) {
    const comment = db.comments.find((comment) => comment.id === id);
    if (!comment) throw new Error("Comment not found");

    if (typeof text === "string") {
      comment.text = text;
    }
    if (typeof author === "string") {
      comment.author = author;
    }

    if (typeof post === "string") {
      comment.post = post;
    }
    return comment;
  },
};

export { Mutation as default };
