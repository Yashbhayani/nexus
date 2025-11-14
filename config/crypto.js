const crypto = require("crypto");

// Secret key (must be 32 bytes for AES-256)
const ENCRYPTION_KEY = crypto
  .createHash("sha256")
  .update(String("YourSecretKey123!"))
  .digest("base64")
  .substr(0, 32);
const IV_LENGTH = 16;

// Encrypt function
const encrypt = (text) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let encrypted = cipher.update(text.toString());
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

// Decrypt function
const decrypt = (text) => {
  const textParts = text.split(":");
  const iv = Buffer.from(textParts.shift(), "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

const encryptedData = data.map((item) => {
  const record = { ...item.dataValues };
  for (const key in record) {
    if (key.toUpperCase().includes("ID") && record[key]) {
      record[key] = encrypt(record[key].toString());
    }
  }
  return record;
});

module.exports = { encryptedData, decrypt };
