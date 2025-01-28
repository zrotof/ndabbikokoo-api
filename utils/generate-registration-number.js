const crypto = require("crypto");

exports.generateRegistrationNumber = (length) => {  
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const firstChar = letters.charAt(Math.floor(Math.random() * letters.length));
    const remainingDigits = crypto.randomInt(Math.pow(10, length - 1), Math.pow(10, length)).toString().slice(0, length - 1);
  
    return firstChar + remainingDigits;
}