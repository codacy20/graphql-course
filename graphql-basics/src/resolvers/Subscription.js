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
};

export { Subscription as default };
