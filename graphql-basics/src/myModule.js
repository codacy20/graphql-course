// named export
const message = "some message from my module";
// default export
const location = "here";

const getGreeting = (name) => {
  return `hi this is ${name}`;
};

export { message, location as default, getGreeting };
