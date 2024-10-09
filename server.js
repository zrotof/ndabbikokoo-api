const express = require('express');
const cors = require('./cors');
const bodyParser = require('body-parser');
const config = require('./config/dot-env');

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req,res)=>{
    res.send("Le monde chico et tout ce qu'il ya dedans")
})

app.use("/v1", cors.corsWithOptions, require('./routes'))

app.listen(config.port, () => {
    console.log(`Listening on port : ${config.port}`)
});