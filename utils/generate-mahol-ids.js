const crypto = require("crypto");

exports.generateMaholId = (count, suffix) => {
    const prefix = "MHL";
    const year = new Date().getFullYear();

    const randomString = crypto
    .randomBytes(3)
    .toString('base64')
    .replace(/[^a-zA-Z0-9]/g,'')
    .slice(0,6);

    const id = `${prefix}-${year}${String(count).padStart(4,'0')}-${randomString}-${suffix}`;

    return id;
}