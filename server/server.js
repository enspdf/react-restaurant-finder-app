require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(morgan("tiny"));
app.use(express.json());
app.use(cors());

app.get("/api/v1/restaurants", async (req, res) => {
  try {
    const results = await db.query(" SELECT * FROM restaurants ");
    const restaurantRatingsData = await db.query(`
      SELECT * FROM restaurants LEFT JOIN (
        SELECT restaurant_id, COUNT(*), TRUNC(AVG(rating), 1) AS average_rating 
        FROM reviews GROUP BY restaurant_id
      ) reviews ON restaurants.id = reviews.restaurant_id
    `);

    res.status(200).json({
      status: "success",
      results: restaurantRatingsData.rows.length,
      data: {
        restaurants: restaurantRatingsData.rows,
      },
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/v1/restaurants/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const restaurant = await db.query(
      `
      SELECT * FROM restaurants LEFT JOIN (
        SELECT restaurant_id, COUNT(*), TRUNC(AVG(rating), 1) AS average_rating 
        FROM reviews GROUP BY restaurant_id
      ) reviews ON restaurants.id = reviews.restaurant_id
       WHERE id = ${id}`
    );

    const reviews = await db.query(
      `SELECT * FROM reviews WHERE restaurant_id = ${id}`
    );

    res.status(200).json({
      status: "sucess",
      data: {
        restaurant: restaurant.rows[0],
        reviews: reviews.rows,
      },
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/v1/restaurants", async (req, res) => {
  const { name, location, price_range } = req.body;

  try {
    const results = await db.query(
      ` INSERT INTO restaurants (name, location, price_range) VALUES ('${name}', '${location}', ${price_range}) RETURNING * `
    );

    res.status(201).json({
      status: "sucess",
      data: {
        restaurant: results.rows[0],
      },
    });
  } catch (error) {
    console.log(error);
  }
});

app.put("/api/v1/restaurants/:id", async (req, res) => {
  const { id } = req.params;
  const { name, location, price_range } = req.body;

  try {
    const results = await db.query(
      ` UPDATE restaurants SET name = '${name}', location = '${location}', price_range = '${price_range}' WHERE id = ${id} RETURNING * `
    );

    res.status(201).json({
      status: "sucess",
      data: {
        restaurant: results.rows[0],
      },
    });
  } catch (error) {
    console.log(error);
  }
});

app.delete("/api/v1/restaurants/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const results = await db.query(
      ` DELETE FROM restaurants WHERE id = ${id} `
    );

    res.status(204).json({ status: "sucess" });
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/v1/restaurants/:id/addReview", async (req, res) => {
  const { id } = req.params;
  const { name, rating, review } = req.body;

  try {
    const newReview = await db.query(
      `INSERT INTO reviews (restaurant_id, name, review, rating) VALUES (${id}, '${name}', '${review}', ${rating}) RETURNING *`
    );

    res.status(201).json({
      status: "success",
      data: {
        review: newReview.rows[0],
      },
    });
  } catch (error) {
    console.error(error);
  }
});

const port = process.env.PORT || 3005;

app.listen(port, () => {
  console.log(`Server is up and listening on port ${port}`);
});
