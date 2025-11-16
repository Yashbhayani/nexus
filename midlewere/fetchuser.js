const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Yashisagoodboy';

const fetchUser = (req, res, next) => {
  const token = req.header('auth-token');
  console.log("Middleware fetchUser invoked. Token:", token);

  if (!token) {
    // ❌ old: res.status(401).send(...)
    // ✅ new: return immediately to stop execution
    return res.status(401).json({ success: false, error: 'Please authenticate using a valid token' });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    console.log("Token verified. User data:", data);
    req.user = data.user;
    next(); // ✅ only if token is valid
  } catch (e) {
    // same here — return after sending the response
    return res.status(401).json({ success: false, error: e.message });
  }
};

module.exports = fetchUser;
