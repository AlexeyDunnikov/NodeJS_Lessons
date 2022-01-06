const express = require("express");
const mysql = require("mysql");
const app = express();
const nodemailer = require("nodemailer");

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
  const goods = new Promise((resolve, reject) => {
    connection.query("SELECT * FROM goods", (err, result, fields) => {
      if (err) reject(err);
      resolve(result);
    });
  });

  const categories = new Promise((resolve, reject) => {
    connection.query("SELECT * FROM category", (err, result, fields) => {
      if (err) reject(err);
      resolve(result);
    });
  });

  Promise.all([goods, categories]).then((value) => {
    res.render("main", {
      goods: JSON.parse(JSON.stringify(value[0])),
      categories: JSON.parse(JSON.stringify(value[1])),
    });
  });
});

app.get("/cat", (req, res) => {
  const catId = req.query.id;

  const cat = new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM category WHERE id=${+catId}`,
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  });

  const goods = new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM goods WHERE category=${+catId}`,
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  });

  Promise.all([cat, goods]).then((value) => {
    res.render("category", {
      cat: JSON.parse(JSON.stringify(value[0]))[0],
      goods: JSON.parse(JSON.stringify(value[1])),
    });
  });
});

app.get("/goods", (req, res) => {
  connection.query(
    `SELECT * FROM goods WHERE id=${req.query.id}`,
    (err, result, fields) => {
      if (err) throw err;
      res.render("goods", {
        goods: JSON.parse(JSON.stringify(result))[0],
      });
    }
  );
});

app.get("/order", (req, res) => {
  res.render("order");
});

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
  if (req.body.key.length === 0) {
    res.send("0");
    return;
  }

  const goods = {};
  const keys = req.body.key;

  connection.query(
    `SELECT id, name, cost FROM goods WHERE id IN (${keys.join(",")})`,
    (err, result, fields) => {
      if (err) throw err;

      result.forEach((item) => {
        goods[item.id] = item;
      });

      res.json(goods);
    }
  );
});

app.post("/finish-order", (req, res) => {
  console.log(req.body);
  if (req.body.key.length !== 0) {
    let keys = Object.keys(req.body.key);

    connection.query(
      `SELECT id, name, cost FROM goods WHERE id IN (${keys.join(",")})`,
      (err, result, fields) => {
        if (err) throw err;

        sendEMail(req.body, result);
        // .catch(err){
        //   (console.error);
        // }

        //res.send("1");
      }
    );
  } else {
    res.send("0");
  }
});

async function sendEMail(data, result) {
  let total = 0;
  let res = "<h2>Заказ alex shop</h2>";

  result.forEach(item => {
    res += `<p>${item.name}: ${data.key[item.id]} - ${getPrice(
      item.cost * data.key[item.id]
    )}</p>`;
    total += item.cost * data.key[item.id];
  });
  res += '<hr>';
  res += `<h3>Итого: ${getPrice(total)}</h3>`
  res += '<hr>';
  res += `<p>Имя: ${data.username}</p>`;
  res += '<hr>';
  res += `<p>Телефон: ${data.phone}</p>`;
  res += '<hr>';
  res += `<p>E-mail: ${data.email}</p>`;
  res += '<hr>';
  res += `<p>Адрес: ${data.address}</p>`;

  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  let mailOptions = {
    from: "<dunnikov223@gmail.com>",
    to: `dunnkov223@gmail.com, ${data.email}`,
    subject: "Alex shop order",
    text: "hello",
    html: res,
  };

  let info = await transporter.sendMail(mailOptions);

  console.log("Message sent %s", info.messageId);
  console.log("Preview sent %s", nodemailer.getTestMessageUrl(info));

  return true;
}

function getPrice(price) {
  return new Intl.NumberFormat("ru-RU", {
    currency: "BYN",
  }).format(price);
}
