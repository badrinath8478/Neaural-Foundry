require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');
app.use(cors());

const userRoutes = require("./routes/user");
const movieRoutes = require("./routes/movie");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("DB Connected!");
    })
    .catch((err) => {
        console.log(err);
    });

app.use("/user", userRoutes);
app.use("/user", movieRoutes);

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
            err: error,
        },
    });
});

module.exports = app;
