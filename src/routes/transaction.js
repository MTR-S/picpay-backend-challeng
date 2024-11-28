const express = require("express");
const router = express.Router();

const transactionController = require("../controllers/transaction");

router.post("/post", transactionController.postTransaction);

module.exports = router;
