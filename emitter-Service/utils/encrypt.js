const { createHmac, createCipheriv } = require("crypto");

const getSha256Hash = (data) => {
  const secret = process.env.SHA_256_HASH_SECRET;

  const stringData = JSON.stringify(data);

  const sha256Hash = createHmac("SHA256", secret)
    .update(stringData, "utf-8")
    .digest("base64");

  return sha256Hash;
};

const getEncryptedMessage = (data) => {
  const key = process.env.ENCRYPT_DECRYPT_SECRET_KEY;
  const iv = process.env.INITIALIZATION_VECTOR_SECRET;

  const stringData = JSON.stringify(data);

  const encrypterIv = createCipheriv("aes-256-ctr", key, iv);
  let encryptedMessage = encrypterIv.update(stringData, "utf8", "hex");
  encryptedMessage += encrypterIv.final("hex");

  return encryptedMessage;
};

module.exports = { getSha256Hash, getEncryptedMessage };
