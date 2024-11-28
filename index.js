const express = require("express");
const mongoose = require("mongoose");

const transactioRoutes = require("./src/routes/transaction");
const usersRoutes = require("./src/routes/users");

const app = express();

app.use(express.json());

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to Mongodb!");

    app.listen(3000, () => {
      console.log(
        "Server is running on http://localhost:3000/transaction/post"
      );
    });
  } catch (error) {
    throw new Error(error);
  }
}

app.use("/users", usersRoutes);
app.use("/transaction", transactioRoutes);

startServer();
