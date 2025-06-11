const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//login functionality
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username?.trim() || !password?.trim()) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    const user = await User.findOne({
      username: new RegExp(`^${username.trim()}$`, "i"),
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log(`Login attempt for: ${username}`);
    console.log(`Input password: ${password}`);
    console.log(`Stored hash: ${user.password}`);

    const isMatch = await bcrypt.compare(password.trim(), user.password);
    console.log(`Password match: ${isMatch}`);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = await user.generateAuthToken();

    res.json({
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

//logout functionality
exports.logout = async (req, res) => {
  try {
    if (!req.user || !req.token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const currentToken = req.token.trim();
    const initialTokenCount = req.user.tokens.length;

    req.user.tokens = req.user.tokens.filter(
      (t) => t.token.trim() !== currentToken
    );

    if (req.user.tokens.length === initialTokenCount) {
      console.warn("Token not found in user tokens array");
    }

    await req.user.save();
    res.json({ message: "Logged out successfully" });
    const savedUser = await req.user.save();
    if (!savedUser) {
      throw new Error("User document failed to save");
    }

    const stillExists = await User.findOne({
      _id: req.user._id,
      "tokens.token": req.token,
    });

    if (stillExists) {
      console.error("Token still exists after logout attempt");
      throw new Error("Token persistence error");
    }

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Detailed logout error:", {
      message: error.message,
      stack: error.stack,
      user: req.user ? req.user._id : null,
      token: req.token ? req.token.slice(0, 10) + "..." : null,
    });
    res.status(500).json({
      error: "Logout failed",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
