const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: "pkcs1",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs1",
    format: "pem",
  },
});

const keysDir = path.join(__dirname, "..", "rsa-keys");
if (!fs.existsSync(keysDir)) {
  fs.mkdirSync(keysDir);
}

// Create the public key file
fs.writeFileSync(path.join(keysDir, "id_rsa_pub.pem"), publicKey);

// Create the private key file
fs.writeFileSync(path.join(keysDir, "id_rsa_priv.pem"), privateKey);
