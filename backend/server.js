require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

const path = require("path");

// Все HTML/JS/CSS-файлы публичные
app.use(express.static("public"));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/users", require("./routes/users"));

app.use(errorHandler);

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
