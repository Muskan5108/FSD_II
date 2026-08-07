const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;
const JWT_SECRET = "my_super_secret_key";

const user = {
    id: 1,
    username: "student",
    password: bcrypt.hashSync("123456", 10)
};

app.get("/", (req, res) => {
    res.send("JWT Authentication Backend is running!");
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (username !== user.username) {
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }

    const validPassword = await bcrypt.compare(
        password,
        user.password
    );

    if (!validPassword) {
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }

    const token = jwt.sign(
        {
            id: user.id,
            username: user.username
        },
        JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.json({
        message: "Login successful",
        token: token
    });
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Access token required"
        });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                message: "Invalid or expired token"
            });
        }

        req.user = decoded;
        next();
    });
}

app.get("/profile", authenticateToken, (req, res) => {
    res.json({
        message: "Protected profile accessed successfully",
        user: req.user
    });
});

const server = app.listen(PORT, "127.0.0.1", () => {
    console.log("Server running on http://localhost:5000");
});

server.on("error", (error) => {
    console.error("Server error:", error);
});