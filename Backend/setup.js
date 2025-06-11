const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

async function setup() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    await User.deleteMany({ username: { $in: ["admin", "user"] } });

    const admin = new User({
      username: "admin",
      password: "admin123",
      role: "admin",
    });
    await admin.save();
    console.log("✅ Admin user created successfully");
    console.log("Username: admin");
    console.log("Password: admin123");

    const user = new User({
      username: "user",
      password: "user123",
      role: "user",
    });
    await user.save();
    console.log("✅Regular user created successfully");
    console.log("Username: user");
    console.log("Password: user123");
  } catch (error) {
    console.error("Setup failed:", error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

setup();
