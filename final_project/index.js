const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  const { username, password } = req.body;
  // Verify the user's credentials
  // If the credentials are valid, generate a JWT and return it to the user
  const user = { id: 1, username: "test_user" };
  const token = jwt.sign(user, "your_secret_key", { expiresIn: "1h" });
  res.json({ token });
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
