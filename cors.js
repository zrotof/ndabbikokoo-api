const cors = require('cors');

//liste of url accepted on request
const whiteList = [
    'http://localhost:4200',
    'http://localhost:4201',
    'http://localhost:4202',
    'https://shadow.ndabbikokoo.com',
    'https://www.shadow.ndabbikokoo.com',
    'https://dev-admin.ndabbikokoo.com',
    'https://www.dev-admin.ndabbikokoo.com'
];

//Return true of false according to if the url calling the resources is known
var corsOptionDelegate  = (req, callback) => {
    let corsOptions;

    if(whiteList.indexOf(req.header('Origin')) !== -1){
        corsOptions = { 
            origin: true,
            credentials: true 
        }
    }

    else{
        corsOptions = { origin: false};
    }

    callback(null, corsOptions);
}

exports.corsWithOptions = cors(corsOptionDelegate);