const Subscription = {
  comment: {
    subscribe(parent, { postId }, { db, pubSub }, info) {
      const post = db.posts.find((post) => {
        return post.id === postId && post.published;
      });

      if (!post) throw new Error("no post found");

      return pubSub.asyncIterator("comment");
    },
  },
  post: {
    subscribe(parent, args, { db, pubSub }, info) {
      return pubSub.asyncIterator("post");
    },
  },
};

export { Subscription as default };
