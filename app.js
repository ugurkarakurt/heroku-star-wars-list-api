const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const db = require("./db.json");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json(db);
});

app.get("/orders", (req, res) => {
  res.status(200).json(db.orders);
});

app.get("/orders/:id", (req, res) => {
  if (isNaN(req.params.id)) {
    res.status(400).json({
      error_code: "not_found_101",
      message: "Invalid parameter.",
    });
  } else {
    const order = db.orders.find((order) => order.id == req.params.id);
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({
        error_code: "not_found_100",
        message: "Order not found.",
      });
    }
  }
});

app.post("/orders", (req, res) => {
  const willSaveData = {
    id: new Date().getTime(),
    title: req.body.title,
    image_url: req.body.image_url,
    last_update_date: req.body.last_update_date,
    favorite_count: req.body.favorite_count,
    urgent: req.body.urgent,
  };

  if (willSaveData) {
    db.orders.push(willSaveData);
    res.status(201).json(willSaveData);
  } else {
    res.status(404).json({
      error_code: "not_found_100",
      message: "Order not saved.",
    });
  }
});

app.patch("/orders/:id", (req, res) => {
  if (isNaN(req.params.id)) {
    res.status(400).json({
      error_code: "not_found_101",
      message: "Invalid parameter.",
    });
  } else {
    const order = db.orders.find((order) => order.id == req.params.id);
    if (order) {
      Object.keys(req.body).forEach((key) => {
        order[key] = req.body[key];
      });
      res.status(200).json(order);
    } else {
      res.status(404).json({
        error_code: "not_found_100",
        message: "Order not found.",
      });
    }
  }
});

app.delete("/orders/:id", (req, res) => {
  if (isNaN(req.params.id)) {
    res.status(400).json({
      message: "Invalid parameter.",
    });
  } else {
    const orderIndex = db.orders.findIndex((order) => order.id == req.params.id);
    if (orderIndex > -1) {
      db.orders.splice(orderIndex, 1);
      res.status(204).json();
    } else {
      res.status(404).json({
        error_code: "not_found_100",
        message: "Order not found.",
      });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
