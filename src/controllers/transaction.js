const axios = require("axios").default;

const User = require("../models/users");
const Transaction = require("../models/transaction");

exports.postTransaction = async (req, res) => {
  /*
  const { amount, payer, payee } = req.body;

  const payerUser = await User.findOne({ id: payer });

  if (payerUser.type === "shopkeeper") {
    res.status(400).send({ error: "Shopkeeper cannot make transactions" });
  } else if (payerUser.balance < amount) {
    res.status(400).send({ error: "Insufficient balance" });
  }
*/

  axios
    .get("https://util.devi.tools/api/v2/authorize")
    .then((situacaoDoServico) => {
      if (!situacaoDoServico.data.authorization) {
        res.status(500).send({ error: "Sorry, transcation not authorizaded" });
      }
    })
    .catch((error) => {
      console.log(error.message);
      res.status(500).send({ error: "Internal server error" });
    });

  /*
  const transaction = new Transaction({
    amount,
    payer,
    payee,
  });

  try {
    await transaction.save();
    res.status(201).send("Transaction created successfully");
  } catch (error) {
    res.status(400).send("Error creating transaction");
  }*/
};
