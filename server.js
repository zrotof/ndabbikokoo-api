const helmet = require("helmet");
const express = require("express");
const passport = require("passport");
const cookieParser = require('cookie-parser');
const cors = require("./cors");
const config = require("./config/dot-env");
const loggerMiddleware = require("./middlewares/logger.middleware");
const errorMiddleware = require("./middlewares/error-handler.middleware");
const logger = require('./config/logger');

const app = express();

require("./config/passport")(passport);

app.use(cookieParser());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(loggerMiddleware);

app.get("/", (req, res) => {
  res.send("Le monde chico et tout ce qu'il ya dedans");
});

app.use("/v1", cors.corsWithOptions, require("./routes"));

app.use(errorMiddleware);

app.listen(config.port || 3000, () => {
  logger.info(`Le serveur écoute sur le port ${config.port || 3000}`);
});
