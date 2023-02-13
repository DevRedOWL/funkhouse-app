const { writeFileSync } = require("fs");

function capFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const names = require("./common/names.json");
const surnames = require("./common/surnames.json");

function generateName() {
  var name =
    capFirst(names[getRandomInt(0, names.length + 1)]) +
    " " +
    capFirst(surnames[getRandomInt(0, surnames.length + 1)]);
  return name;
}

module.exports = {
  generateName,
};
