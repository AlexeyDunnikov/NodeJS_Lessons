const express = require("express");
const mysql = require("mysql");
const app = express();

app.use(express.static("public"));

app.set("view engine", "pug");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "market",
});

app.listen(3000, () => {
  console.log("Server is running on 3000");
});

app.get("/", (req, res) => {
  connection.query("SELECT * FROM goods", (error, result) => {
    if (error) throw error;
    //console.log(result);

    const goods = {};
    for (let i = 0; i < result.length; i++) {
      goods[result[i]["id"]] = result[i];
    }

    console.log(JSON.parse(JSON.stringify(goods)));

    res.render("main", {
      title: "Main",
      goods: JSON.parse(JSON.stringify(goods)),
    });
  });
});
