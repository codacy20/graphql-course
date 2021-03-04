const Query = {
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
};

export { Query as default };
