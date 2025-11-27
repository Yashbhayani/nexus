const jwt = require("jsonwebtoken");
const JWT_SECRET = "NexusCampus";

const fetchUser = (req, res, next) => {
  const token = req.header("auth-token");
  console.log(token);

  if (!token) {
    // ❌ old: res.status(401).send(...)
    // ✅ new: return immediately to stop execution
    return res.status(401).json({
      success: false,
      error: "Please authenticate using a valid token",
    });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next(); // ✅ only if token is valid
  } catch (e) {
    // same here — return after sending the response
    console.log(e.message);
    return res.status(401).json({ success: false, error: e.message });
  }
};

module.exports = fetchUser;
