const express = require("express");
const mysql = require("mysql");
const app = express();

app.use(express.static("public"));

app.set("view engine", "pug");

app.use(express.json());

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
  connection.query("SELECT * FROM goods", (err, result) => {
    if (err) throw err;
    //console.log(result);

    const goods = {};
    for (let i = 0; i < result.length; i++) {
      goods[result[i]["id"]] = result[i];
    }

    res.render("main", {
      title: "Main",
      goods: JSON.parse(JSON.stringify(goods)),
    });
  });
});

app.get('/cat', (req, res) => {
    const catId = req.query.id;

    const cat = new Promise((resolve, reject) => {
        connection.query(
            `SELECT * FROM category WHERE id=${+catId}`,
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        )
    });

    const goods = new Promise((resolve, reject) => {
        connection.query(
            `SELECT * FROM goods WHERE category=${+catId}`,
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        )
    });

    Promise.all([cat, goods]).then((value) => {
        console.log(JSON.parse(JSON.stringify(value[0])));
        res.render('category', {
            cat: JSON.parse(JSON.stringify(value[0]))[0],
            goods: JSON.parse(JSON.stringify(value[1])),
        })
    })
})

app.get('/goods', (req, res) => {
    connection.query(
        `SELECT * FROM goods WHERE id=${req.query.id}`,
        (err, result, fields) => {
            if (err) throw err;
            res.render("goods", {
              goods: JSON.parse(JSON.stringify(result))[0],
            });
        }
    )
})

app.post("/get-category-list", (req, res) => {
  connection.query(
    `SELECT id, category FROM category`,
    (err, result, fields) => {
      if (err) throw err;
      res.json(result);
    }
  );
});

app.post("/get-goods-info", (req, res) => {
  const goods = {};

  console.log(req.body.key);
  const keys = req.body.key;

  connection.query(
    `SELECT id, name, cost FROM goods WHERE id IN (${keys.join(',')})`,
    (err, result, fields) => {
      if (err) throw err;

      result.forEach(item => {
        goods[item.id] = item;
      })
      
      res.json(goods);
    }
  );
});
