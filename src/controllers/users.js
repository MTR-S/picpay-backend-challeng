const User = require("../models/users");

exports.postSignup = async (req, res) => {
  const { firstName, lastName, document, email, balance, type } = req.body;

  const userWithSameEmail = await User.findOne({ email: email });
  const userWithSameDocument = await User.findOne({ document: document });

  if (userWithSameEmail) {
    res.status(400).send({ error: "Email already registered" });
  } else if (userWithSameDocument) {
    res.status(400).send({ error: "Document already registered" });
  }

  const user = new User({
    firstName,
    lastName,
    document,
    email,
    balance,
    type,
  });

  try {
    await user.save();
    res.status(201).send("User created successfully");
  } catch (err) {
    res.status(400).send(err);
  }
};
