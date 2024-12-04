const helmet = require('helmet');
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const cors = require('./cors');
const config = require('./config/dot-env');
const errorMiddleware = require('./middlewares/error-handler.middleware')

const app = express();

app.use(helmet());

require('./config/passport')(passport);
app.use(passport.initialize());

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req,res)=>{
    res.send("Le monde chico et tout ce qu'il ya dedans")
})

app.use("/v1", cors.corsWithOptions, require('./routes'))

app.use(errorMiddleware)

app.listen(config.port || 3000 , () => {
    console.log(`Listening on port : ${config.port}`)
});