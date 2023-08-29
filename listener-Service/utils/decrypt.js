const { createDecipheriv, createHmac, timingSafeEqual } = require("crypto");

// validate sha-256 Hmac using secret_key and hash_secret
const validateHmac = (secret_key, data) => {
  const stringData = JSON.stringify(data);
  const secret = process.env.SHA_256_HASH_SECRET;

  const sha256Hash = createHmac("SHA256", secret)
    .update(stringData, "utf-8")
    .digest("base64");

  const providedHmac = Buffer.from(secret_key, "utf-8");
  const generatedHash = Buffer.from(sha256Hash, "utf-8");

  if (!timingSafeEqual(generatedHash, providedHmac)) {
    throw new Error("Invalid request");
  }
};

// decrypting the data using decryption algorithm `aes-256-ctr` with a pass key
const decryptAndValidateData = async (messageArray, time) => {
  const decryptArray = [];
  const HMACFailCount = 0;

  const iv = process.env.INITIALIZATION_VECTOR_SECRET;
  const key = process.env.ENCRYPT_DECRYPT_SECRET_KEY;

  try {
    messageArray.forEach((element) => {
      const decrypterIv = createDecipheriv("aes-256-ctr", key, iv);
      let decryptedMessage = decrypterIv.update(element, "hex", "utf8");
      decryptedMessage += decrypterIv.final("utf8");

      const { secret_key, ...originalMessage } = JSON.parse(decryptedMessage);

      try {
        validateHmac(secret_key, originalMessage);

        originalMessage["time_stamp"] = time;

        decryptArray.push(originalMessage);
      } catch (error) {
        HMACFailCount += 1;
      }
    });
    const failureRate = (HMACFailCount / messageArray.length) * 100;

    return { decryptArray, failureRate };
  } catch (err) {
    console.error(err);
  }
};

module.exports = { decryptAndValidateData };
