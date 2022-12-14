const { MongoClient, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();
const PORT = +process.env.PORT || 5000;
const URI = process.env.URI;
const client = new MongoClient(URI);
const DB = process.env.DB;
const DBCOLLECTION = process.env.DBCOLLECTION;

app.use(express.json());
app.use(cors());

app.get("/orders", async (_, res) => {
  try {
    const connection = await client.connect();
    const data = await connection
      .db(DB)
      .collection(DBCOLLECTION)
      .find()
      .toArray();

    await connection.close();

    return res.send(data).end();
  } catch (error) {
    res.status(500).send({ error }).end();
  }
});

app.post("/order", async (req, res) => {
  const { productName, quantity, isInStock, createDate } = req.body || {};

  if (!productName) {
    return res.status(400).send("Product name not provided").end();
  }

  if (typeof productName !== "string") {
    return res.status(400).send(`${productName} is not a string`).end();
  }

  try {
    const connection = await client.connect();
    const data = await connection
      .db(DB)
      .collection(DBCOLLECTION)
      .insertOne({
        productName,
        quantity,
        isInStock,
        createDate: new Date(createDate).toISOString(),
      });

    await connection.close();

    return res.send(data).end();
  } catch (error) {
    res.status(500).send({ error }).end();
  }
});

app.post("/orders", async (req, res) => {
  const { newOrders } = req.body;
  const isOrdersProvided = Array.isArray(newOrders) && newOrders?.length;

  const isCorrectOrder = (newOrder) => {
    const { productName, quantity, isInStock, createDate } = newOrder;
  };

  if (!isOrdersProvided) {
    res.status(404).send("Plesae provide an array of objects.");
  }

  newOrders.forEach(isCorrectOrder);
  // newOrders.forEach((newOrder) => isCorrectOrder(newOrder));

  try {
    const connection = await client.connect();
    const data = await connection
      .db(DB)
      .collection(DBCOLLECTION)
      .insertMany(newOrders);

    await connection.close();

    res.send(data).end();
  } catch (error) {
    res.status(500).send({ error }).end();
  }
});

app.patch("/order/:id", async (req, res) => {
  const { productName, quantity } = req.body;
  const { id } = req.params;
  const isProperProductName = productName && typeof productName === "string";
  const isProperQuantity =
    typeof quantity === "number" && !Number.isNaN(quantity);

  if (!productName && !quantity) {
    return res
      .status(400)
      .send({ message: "Product name and quantity not provided" })
      .end();
  }

  // if (!isProperProductName) {
  //   return res.status(400).send(`${productName} is not a string`).end();
  // }

  // if (!isProperQuantity) {
  //   return res.status(400).send(`${quantity} is not a number`).end();
  // }

  try {
    const connection = await client.connect();
    const data = connection.db(DB);
    const updateValues = {};

    if (isProperProductName) {
      updateValues.productName = productName;
    }

    if (isProperQuantity) {
      updateValues.quantity = quantity;
    }

    const order = await data
      .collection(DBCOLLECTION)
      .findOneAndUpdate({ _id: ObjectId(id) }, { $set: updateValues });

    await connection.close();

    res.send(order).end();
  } catch (error) {
    return res.send({ error }).end();
  }
});

app.delete("/order/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send({ message: "No id provided" }).end();
  }

  try {
    const connection = await client.connect();
    const data = connection.db(DB);

    const order = await data
      .collection(DBCOLLECTION)
      .deleteOne({ _id: ObjectId(id) });

    await connection.close();

    if (order.deletedCount) {
      return res.status(200).send(order).end();
    }
    res
      .status(404)
      .send({ message: "An order with the provided id does not exists." })
      .end();
  } catch (error) {
    return res.send({ error }).end();
  }
});

app.get("/orders-analysis", async (req, res) => {
  // const { isInStock } = req.body;
  const pipeline = [
    {
      $match: {
        isInStock: false,
      },
    },
    {
      $group: {
        _id: "$isInStock",
        totalQuantity: { $sum: "$quantity" },
      },
    },
    {
      $sort: { totalQuantity: -1 },
    },
  ];

  //to do if

  try {
    const elements = [];
    const connection = await client.connect();

    const elementsCount = await connection
      .db(DB)
      .collection(DBCOLLECTION)
      .count({ isInStock: true });

    const products = await connection
      .db(DB)
      .collection(DBCOLLECTION)
      .distinct("productName");

    const aggregationCursor = await connection
      .db(DB)
      .collection(DBCOLLECTION)
      .aggregate(pipeline);

    for await (const element of aggregationCursor) {
      elements.push(element);
    }

    await connection.close();

    res.send({ elements, elementsCount, products }).end();
  } catch (error) {
    res.status(500).send({ error }).end();
    throw Error(error);
  }
});

app.post("/", (_, res) => {
  res.send({ message: "Welcome to Alex project" }).end();
});

app.listen(PORT, () => console.info(`Server is running on ${PORT} port`));
