require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { errors } = require("celebrate");
const cards = require("./routes/cards");
const users = require("./routes/users");
const auth = require("./middlewares/auth");
const { createUser, login } = require("./controllers/users");
const { errorHandler } = require("./middlewares/errorHandler");
const { validateSignUp, validateSignIn } = require("./middlewares/validators");
const { NotFoundError } = require("./utils/errors");

const { PORT = 3000, MONGODB = "mongodb://localhost:27017/mestodb" } =
  process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
};

mongoose.connect(MONGODB, options).catch((error) => {
  console.error(error);
  process.exit(1);
});

mongoose.connection.on("error", (error) => {
  console.error(error);
});

const app = express();
app.use(helmet());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

app.post("/signup", validateSignUp, createUser);
app.post("/signin", validateSignIn, login);

app.use(auth);

app.use("/users", users);
app.use("/cards", cards);

app.use("*", (req, res, next) => {
  next(new NotFoundError("Запрашиваемый ресурс не найден."));
});

app.use(errors());
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
