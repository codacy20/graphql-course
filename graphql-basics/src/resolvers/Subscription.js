const Subscription = {
  count: {
    subscribe(parent, args, ctx, info) {
      let count = 0;
      setInterval(() => {
        count++;
        ctx.pubSub.publish("count", { count });
      }, 1000);
      return ctx.pubSub.asyncIterator("count");
    },
  },
  comment: {
    subscribe(parent, { postId }, { db, pubSub }, info) {
      const post = db.posts.find((post) => {
        return post.id === postId && post.published;
      });

      if (!post) throw new Error("no post found");

      return pubSub.asyncIterator("comment " + postId);
    },
  },
};

export { Subscription as default };
