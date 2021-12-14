const path = require("path");
const fs = require("fs");

const p = path.join(__dirname, "..", "data", "card.json");

class Card {
  static async add(course) {
    const card = await Card.fetch();

    const ind = card.courses.findIndex((c) => c.id === course.id);

    if (ind !== -1) {
      card.courses[ind].count++;
    } else {
      course.count = 1;
      card.courses.push(course);
    }

    card.price += +course.price;

    return new Promise((resolve, reject) => {
      fs.writeFile(p, JSON.stringify(card), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  static async fetch() {
    return new Promise((resolve, reject) => {
      fs.readFile(p, "utf-8", (err, content) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(content));
        }
      });
    });
  }

  static async remove(id) {
    const card = await Card.fetch();

    const ind = card.courses.findIndex((c) => c.id === id);
    const course = card.courses[ind];

    if (course.count === 1) {
        card.courses = card.courses.filter(c => c.id !== id);
    }
    else {
      card.courses[ind].count--;
    }

    card.price -= course.price;

    return new Promise((resolve, reject) => {
      fs.writeFile(p, JSON.stringify(card), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(card);
        }
      });
    });
  }
}

module.exports = Card;
