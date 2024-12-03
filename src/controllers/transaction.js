const axios = require("axios").default;
const sgMail = require("@sendgrid/mail");

const Users = require("../models/users");
const Transaction = require("../models/transaction");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.postTransaction = async (req, res) => {
  const { amount, payer: payerId, payee: payeeId } = req.body;

  try {
    const payerUser = await Users.findById(payerId);

    if (payerUser.type === "shopkeeper") {
      res.status(400).send({ error: "Shopkeeper cannot make transactions" });
    } else if (payerUser.balance < amount) {
      res.status(400).send({ error: "Insufficient balance" });
    }
  } catch (error) {
    res.status(400).send("Error finding payer user");
  }

  try {
    const situacaoDoServico = await axios.get(
      "https://util.devi.tools/api/v2/authorize",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(situacaoDoServico.data.data.authorization);
    if (!situacaoDoServico.data.data.authorization) {
      res
        .status(500)
        .send({ error: "Sorry, transcation cannot be authorizaded" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: "Internal server error" });
  }

  const transaction = new Transaction({
    amount,
    payer: payerId,
    payee: payeeId,
  });

  try {
    await transaction.save();
  } catch (error) {
    res.status(400).send("Error creating transaction");
    return;
  }

  try {
    const payerUser = await Users.findById(payerId);

    const newPayerAmount = (payerUser.balance -= BigInt(amount));
    await payerUser.updateOne({ balance: newPayerAmount });
  } catch (err) {
    console.log(err);
  }

  try {
    const payeeUser = await Users.findById(payeeId);

    const newPayeeAmount = (payeeUser.balance += BigInt(amount));
    await payeeUser.updateOne({ balance: newPayeeAmount });
  } catch (err) {
    console.log(err);
  }

  console.log(
    "Lembrar de resolver o problema dos dados moackados no caso do email"
  );

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

  try {
    const payeeUser = await Users.findById(payeeId);
  } catch (error) {
    console.log("Email not sended: " + error.message);
  }
};
