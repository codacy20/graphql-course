let users = [
  { id: "1", name: "Andrew", email: "me@me.com", age: 20 },
  { id: "2", name: "Amir", email: "me@me.com", age: 22 },
  { id: "3", name: "jeff", email: "me@me.com", age: 23 },
];

let comments = [
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

let posts = [
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

const db = {
  users,
  comments,
  posts,
};

export { db as default };
