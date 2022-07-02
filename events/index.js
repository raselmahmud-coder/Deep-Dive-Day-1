const Class = require("./school");
const newClass = new Class();
// listener an event for belling
newClass.startClass();
newClass.on("bellRing", ({ name, age, role }) => {
  console.log("this is name", name);
  console.log("this is age", age);
  console.log("this is role administrator", role);
  console.log("event is on");
});
