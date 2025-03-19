const JWT = require("jsonwebtoken");

const generateToken = async (payload, secretSignature, tokenLife) => {
  try {
    const options = {
      algorithm: "HS256",
      expiresIn: tokenLife,
    };
    return JWT.sign(payload, secretSignature, options);
  } catch (error) {
    return new Error(error instanceof Error ? error.message : String(error));
  }
};

const verifyToken = async (token, secretSignature) => {
  try {
    const res = await JWT.verify(token, secretSignature);
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
