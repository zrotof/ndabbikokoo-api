const cors = require('cors');

//liste of url accepted on request
const whiteList = [
    'http://localhost:4200',
    'http://localhost:4201',
];

//Return true of false according to if the url calling the resources is known
var corsOptionDelegate  = (req, callback) => {
    var corsOptions;

    if(whiteList.indexOf(req.header('Origin')) !== -1){
        corsOptions = { origin: true};
    }

    else{
        corsOptions = { origin: false};
    }

    callback(null, corsOptions);
}

exports.corsWithOptions = cors(corsOptionDelegate);