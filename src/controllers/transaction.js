const axios = require("axios").default;
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const User = require("../models/users");
const Transaction = require("../models/transaction");

exports.postTransaction = async (req, res) => {
  const { amount, payer, payee } = req.body;
  /*
  const payerUser = await User.findOne({ id: payer });

  if (payerUser.type === "shopkeeper") {
    res.status(400).send({ error: "Shopkeeper cannot make transactions" });
  } else if (payerUser.balance < amount) {
    res.status(400).send({ error: "Insufficient balance" });
  }
*/

  axios
    .get("https://util.devi.tools/api/v2/authorize", {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((situacaoDoServico) => {
      console.log(situacaoDoServico.data.data.authorization);
      if (!situacaoDoServico.data.data.authorization) {
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

  const emailMsg = {
    to: "matheusalmeidass14@gmail.com",
    from: "almeida.matheus07@aluno.ifce.edu.br",
    subject: "Pic pay Simplified: Payment Situtation",
    text: "You received a new payment using Pic Pay Simplified service",
    html: `
      <body>
      <h1>Successful Transaction!</h1>
      <p>
        PAYER: <strong>almeida.matheus07@aluno.ifce.edu.br</strong><br />
        AMOUNT: R$ <strong>${amount}</strong>
      </p>
    </body>`,
  };

  sgMail
    .send(emailMsg)
    .then(() => {
      console.log("email mandado");
    })
    .catch((error) => {
      console.log("Email not sended: " + error.message);
    });
};
