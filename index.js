const functions = require("firebase-functions");
const express = require("express");
const stripe = require("stripe")("Stripe API key");

const request = require("request");

let port = process.env.PORT || 5050;

const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/", (request, response) => response.status(200).send("hello world"));

app.post("/payments/create", async (request, response) => {
  const total = request.query.total;

  console.log("Payment Request for a total of => ", total);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: total,
    currency: "usd",
    description: "Software development services",
    shipping: {
      name: "email", // TODO: Capture name for {user.displayName}
      address: {
        line1: "510 Townsend St", // TODO: Capture the details from user.
        postal_code: "98140",
        city: "San Francisco",
        state: "CA",
        country: "US",
      },
    },
  });

  response.status(201).send({
    clientSecret: paymentIntent.client_secret,
  });
});

exports.api = functions.https.onRequest(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
