const data = require("../data.json");
const { getSha256Hash, getEncryptedMessage } = require("./encrypt");

// Generate a random integer between min (inclusive) and max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

const createDataStream = () => {
  const randomInteger = getRandomInt(49, 499);
  const encryptedMessageArray = [];
  for (let i = 0; i < randomInteger; i++) {
    const originalMessage = {
      name: getRandomElement(data.names),
      origin: getRandomElement(data.cities),
      destination: getRandomElement(data.cities),
    };

    const sumCheckMessage = {
      ...originalMessage,
      secret_key: getSha256Hash(originalMessage),
    };

    const encryptedMessage = getEncryptedMessage(sumCheckMessage);
    encryptedMessageArray.push(encryptedMessage);
  }
  return encryptedMessageArray.join("|");
};

module.exports = { createDataStream };
