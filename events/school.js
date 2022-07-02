const EventEmitter = require("events");
// const emitter = new EventEmitter();
class School extends EventEmitter{
     startClass = () => {
        const obj = {
          name: "rasel",
          age: 122,
          role: "JS developer",
        };
        console.log("class will be start soon");

        setTimeout(() => {
          this.emit("bellRing", {
            name: obj.name,
            age: obj.age,
            role: obj.role,
          });
        }, 1000);
      };
}

module.exports = School;
