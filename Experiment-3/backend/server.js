const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

const PORT = 5001;
const JWT_SECRET = "experiment3_secret_key";

// Middleware
app.use(cors());
app.use(express.json());

// Dummy users
const users = [
  {
    username: "admin",
    password: "admin123",
    role: "Admin",
  },
  {
    username: "editor",
    password: "editor123",
    role: "Editor",
  },
  {
    username: "viewer",
    password: "viewer123",
    role: "Viewer",
  },
];

// Test backend
app.get("/", (req, res) => {
  res.send("Experiment-3 Backend is running successfully!");
});

// Login API
app.post("/login", (req, res) => {
  const { username, password, role } = req.body;

  const user = users.find(
    (user) =>
      user.username === username &&
      user.password === password &&
      user.role === role
  );

  if (!user) {
    return res.status(401).json({
      message: "Invalid username, password or role",
    });
  }

  // Generate actual JWT
  const token = jwt.sign(
    {
      username: user.username,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  res.status(200).json({
    message: "Login successful",
    token: token,
  });
});

// JWT verification middleware
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Authorization token missing",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Token missing",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(403).json({
      message: "Invalid or expired token",
    });
  }
}

// Protected Posts API
app.get("/posts", verifyToken, (req, res) => {
  res.status(200).json({
    message: "Protected posts accessed successfully",
    user: req.user,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});